import LogsContext from '@/context/LogsContext'
import { useZkVotingRead } from '@/generated/zk-voting'
import colors from '@/styles/colors'
import { Box, Button, Container, Flex, HStack, Icon, IconButton, Image, Link, Radio, RadioGroup, SimpleGrid, Spacer, Stack, Text, useBreakpointValue } from '@chakra-ui/react'
import { Identity } from '@semaphore-protocol/identity'
import { BigNumber } from "ethers/lib/ethers"
import { formatBytes32String } from 'ethers/lib/utils.js'
import parse from 'html-react-parser'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { FaGithub } from "react-icons/fa"
import NoSSR from 'react-no-ssr'
import { useAccount, useDisconnect, useNetwork } from 'wagmi'
import { ButtonActionState, ConnectionState, ConnectionStateType, ZKPoHConnect, useIsRegisteredInPoH, useZkProofOfHumanity, useZkProofOfHumanityRead, useZkProofOfHumanitySignals } from 'zkpoh-widget'
import theme from "../styles/index"
import Card from './Card'


export default function Main() {

  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();

  const zkPoHConfig= {
    confirmationMessage:'I liked this message 👍',
    helpText:'Your identity is registered in ZK Proof of Humanity and generated, so now you can like this message.'
  }

  const { setLogs } = useContext(LogsContext);
  function handleLog(state: ButtonActionState) {
      setLogs(state.logs);
  }
  const [connectionStateType, setConnectionStateType] = useState<ConnectionStateType>()
  const [helpText, setHelpText] = useState<string>();
  function handleChangeState(state:ConnectionState) {
    setConnectionStateType(state.stateType);
    setHelpText(state.helpText);
    if(state.stateType=='IDENTITY_GENERATED'){
        setIdentity(state.identity);
        setAddressIdentity(state.address);

    }
  }


  ///////////////// zkPoH hooks
  const contract = useZkProofOfHumanity();
  const { isHuman } = useIsRegisteredInPoH({ address });

  const { data: groupId } = useZkProofOfHumanityRead({
      functionName: "groupId",
  });
  const { data: semaphoreAddress } = useZkProofOfHumanityRead({
      functionName: "semaphore",
  });
  ////////////////////////

  const router = useRouter()

  useEffect(() => {
    const pollId = router.query.pollId
    if(!pollId) {
        console.error("*** Invalid pollId");
        return;
    }
    const pollIdBig = BigNumber.from(pollId);
    console.log("*** Specific PollId: ", pollId)
    setPollId(pollIdBig);
  }, [router.query.pollId])

  const {data:pollIds} = useZkVotingRead({
    functionName: 'getPollIds',
    enabled: address && chain?.id==1337?true:false,
  });

  const [pollId, setPollId] = useState<BigNumber| undefined>();

  const {data:proposal} = useZkVotingRead({
    functionName: 'polls',
    args: [ pollId?pollId:BigNumber.from("0")],
    enabled: address && chain?.id==1337?true:false && pollId,
  });

  useEffect(() => {
    setPollId(pollIds?pollIds[0]:undefined);
  }, [pollIds])

  const valueSignalYes= 'YES';
  const valueSignalNo= 'NO';


  const [_identity, setIdentity] = useState<Identity>();
  const [_addressIdentity, setAddressIdentity] = useState<`0x${string}` | undefined>();

  const [votesYes, setVotesYes] = useState(0);
  const [votesNo, setVotesNo] = useState(0);


  const [votesPercentageYes, setVotesPercentageYes] = useState(0);
  const [votesPercentageNo, setVotesPercentageNo] = useState(0);


  const [totalCount, setTotalCount] = useState(0);
  const [optionCastedSelected, setOptionCastedSelected] = useState<string>(valueSignalYes);
  function shortenAddress(address: string | undefined | any) {
    if(!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const signals = useZkProofOfHumanitySignals({externalNullifier: pollId});

  useEffect(() => {

         if(!signals) return;

          const resultYes = signals.filter((obj: any) => {
              const signal32Bytes = formatBytes32String(valueSignalYes);
              return (
                  BigNumber.from(signal32Bytes).eq(BigNumber.from(obj.signal))
              );
          });

          const resultNo = signals.filter((obj: any) => {
              const signal32Bytes = formatBytes32String(valueSignalNo);
              return (
                  BigNumber.from(signal32Bytes).eq(BigNumber.from(obj.signal))
              );
          });

          console.log(resultYes);

          setTotalCount(signals.length);
          setVotesYes(resultYes);
          setVotesNo(resultNo);

          const _c1Percentage = (resultYes.length * 100) / signals.length;
          const _c2Percentage = (resultNo.length * 100) / signals.length;

          setVotesPercentageYes(isNaN(_c1Percentage) ? 0 : _c1Percentage);
          setVotesPercentageNo(isNaN(_c2Percentage) ? 0 : _c2Percentage);

  }, [pollId, signals]);


  function ListItem(props: { value: string }) {
  // Correct! There is no need to specify the key here:
  return (
    <NextLink href={{
      pathname: '/',
      query: { pollId: props.value },

    }} >
      <Card  _hover={{
    background: "secondaryGray.800",
    color: "teal.500",
  }} alignItems='left' flexDirection='column' w='100%' mb='0px'  bg={"secondaryGray.900"}
    p='15px'
    px='20px'
    mt='15px'
    mx='auto'>
    <Text color={"secondaryGray.100"} fontWeight='600'>Id: {shortenAddress(props.value?.toString())}</Text>
    </Card>
    </NextLink>
  )

}

   return (
     <>

<NoSSR>

<Card   bg={"secondaryGray.900"}
             flexDirection='column'
             w='99%'
             p='5px'
             px='5px'
             mt='5px'
             mx='auto'>

  <HStack align="center" justify="right"  px={{ base: 4 }}>
    <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
      <Text textAlign={useBreakpointValue({ base: "center", md: "left" })} fontFamily={"heading"} color='secondaryGray.100' fontSize='xl' fontWeight='700'>
        🎭 <b>ZK Proof of Humanity </b>
        <Link href="https://github.com/elmol/zk-proof-of-humanity" isExternal>
           <IconButton aria-label="Github repository" icon={<Icon boxSize={6} as={FaGithub} />} />
        </Link>
      </Text>
    </Flex>
    <Spacer></Spacer>
    {_identity && _addressIdentity && (
      <>
        <Text color='secondaryGray.100' fontSize='md' fontWeight='900' >
          | <b>🔒 Identity:</b>
        </Text>
        <Text color='secondaryGray.100' fontSize='md' fontWeight='800'> - <b>Human Address:</b> </Text> <EtherScanLink   address={_addressIdentity}><Text >{shortenAddress(_addressIdentity)} </Text></EtherScanLink>
        <Text color='secondaryGray.100' fontSize='md' fontWeight='800'> - <b>Identity Commitment:</b> </Text><Text fontSize='md' color="primary.400"> {shortenAddress(_identity?.commitment.toString())} </Text>
      </>
    )}
    {isConnected && contract && (
      <Text color='secondaryGray.100' fontWeight='800'>
        {" "}
        | <b>Contract:</b>  <EtherScanLink address={contract.address}>{shortenAddress(contract.address)}</EtherScanLink>
      </Text>
    )}
   {chain && <Text color='secondaryGray.100' fontWeight='800'> | <b>Network:</b> {chain.unsupported?"Wrong Network":chain.name}</Text>}
    {isConnected && address && (
      <>
        <Text color='secondaryGray.100' fontWeight='800'>
          {" "}
          | <b>Connected to </b> <EtherScanLink  address={address}>{shortenAddress(address)}</EtherScanLink> {isHuman ? "🧑" : "🤖"} |{" "}
        </Text >{" "}
        <Button colorScheme="primary" size="xs" onClick={() => disconnect()}>
          Disconnect
        </Button>
      </>
    )}
  </HStack>
  </Card>
</NoSSR>

<Container flex="1" display="flex"  maxW='100%' bg={'gray.200'}>

   <SimpleGrid columns={{ base: 1, md: 1, lg: 4, '2xl': 4 }} gap='20px' mb='20px'  mt='20px'>

   <Card justifyContent='initial' alignItems='left' flexDirection='column' w='100%' mt='0px' h='100%' >
   <NoSSR>
    <Text me='auto' color={"secondaryGray.900"} fontSize='xl' fontWeight='700' lineHeight='100%' mb="5">
    Proposals
    </Text>

      {pollIds && pollIds.map((number) => <ListItem key={number.toString()}
               value={number.toString()} />)}
    </NoSSR>
  </Card>

   <Card  alignItems='left' flexDirection='column' w='100%' mb='0px'>
     <NoSSR>
         <Stack display="flex" width="100%">
         <Text me='auto' color={"secondaryGray.900"} fontSize='xl' fontWeight='700' lineHeight='100%' mb="5">
           Voting information
         </Text>
             <Text color={"secondaryGray.800"} fontWeight='600'>Id: {shortenAddress(pollId?.toString())}</Text>
             <Text color={"secondaryGray.900"} fontWeight='600'>Details:</Text>
             <Text color={"secondaryGray.800"} fontWeight='600'>{ proposal?parse(proposal):""}</Text>

         </Stack>
     </NoSSR>
   </Card>

   <Card justifyContent='center' alignItems='left' flexDirection='column' w='100%' mb='0px'>


   <Stack direction='column' h="100%" >
     <Text me='auto' color={"secondaryGray.900"} fontSize='xl' fontWeight='700' mt='0px' lineHeight='100%'>
           Vote
     </Text>
     <Stack display="flex" width="100%">

       <Stack display="flex" width="95%" height="100%" mt="4">
             <Text color={"secondaryGray.800"} fontWeight='600' >{helpText}</Text>
       </Stack>
       {connectionStateType=='CAST_SIGNAL' &&  (
         <RadioGroup onChange={setOptionCastedSelected} value={optionCastedSelected} pt='10'>
           <Stack direction='row'>
            <Card  bg={"secondaryGray.600"}
             height='200px'
             px='5px'

             mx='auto'>
                <Flex direction='column' py='5px' me='10px' w="100%" alignItems='center' justifyContent='flex-end' h="100%">
                <Image
                      borderRadius='full'
                      boxSize='150px'
                      src='./yes.png'
                      alt='candidate1'
                      p='3'
                    />
                <Radio color={"primary.800"} value={valueSignalYes} colorScheme='green'>

                  Yes</Radio>
                </Flex>
            </Card>
            <Card bg={"secondaryGray.600"}
             height='200px'
             px='5px'

             mx='auto'>
              <Flex direction='column' py='5px' me='10px' w="100%" alignItems='center' justifyContent='flex-end' h="100%">
                <Image
                      borderRadius='full'
                      boxSize='150px'
                      src='./no.png'
                      alt='candidate 2'
                      p='3'
                    />
              <Radio color={"primary.800"} colorScheme='red' value={valueSignalNo}>No</Radio>
              </Flex>
            </Card>

           </Stack>
         </RadioGroup>)}
         </Stack>
                <Stack alignItems='flex-end' justifyContent='flex-end' h="100%">
            <ZKPoHConnect theme={theme} onChangeState={handleChangeState} onLog={handleLog} signal={optionCastedSelected} externalNullifier={pollId} {...zkPoHConfig}>Vote</ZKPoHConnect>
   </Stack>
       </Stack>
         </Card>
         <Card justifyContent='center' alignItems='center' flexDirection='column' w='100%' mb='0px'>
         <Text me='auto' color={"secondaryGray.900"} fontSize='xl' fontWeight='700' lineHeight='100%'>
           Result of the vote
         </Text>
         <Stack alignItems='center' justifyContent='center' h="100%" w="90%">
           <Card
             bg={"secondaryGray.900"}
             flexDirection='column'
             w='100%'
             p='15px'
             px='20px'
             mt='15px'
             mx='auto'>
                <Flex direction='row' alignItems='center'>
             <Flex direction='column' py='5px'  w="50%" alignItems='center'>
               <Flex align='center'>
                 <Box h='8px' w='8px' bg='green.500' borderRadius='50%' me='4px' />
                 <Text fontSize='xs' color='secondaryGray.100' fontWeight='700' mb='5px'>
                 Yes
                 </Text>
               </Flex>
               <Text fontSize='lg' color='secondaryGray.100' fontWeight='900'>
                ({votesPercentageYes}%)
               </Text>
             </Flex>
             <Flex direction='column' py='5px' me='10px' w="50%" alignItems='center'>
               <Flex align='center'>
                 <Box h='8px' w='8px' bg='red.600' borderRadius='50%' me='4px' />
                 <Text fontSize='xs' color='secondaryGray.100' fontWeight='700' mb='5px'>
                No
                 </Text>
               </Flex>
               <Text  fontSize='lg' color='secondaryGray.100' fontWeight='900'>
                ({votesPercentageNo}%)
               </Text>
             </Flex>

             </Flex>
             <Flex direction='column' alignItems='center' pt="5" >
               <Text fontSize='lg' color='secondaryGray.100' fontWeight='900'><b>Total votes:</b> {totalCount}</Text>
             </Flex>
           </Card>
       </Stack>
       </Card>
       </SimpleGrid>
</Container>
     </>
   );
}

type EtherScanLinkTProps = {
  children: React.ReactNode;
  address: string

}

function EtherScanLink({children,address}:EtherScanLinkTProps ) {
  return (
    <Link color={colors.primary[400]} href={`https://goerli.etherscan.io/address/${address}`} isExternal>{children}</Link>
  )
}
