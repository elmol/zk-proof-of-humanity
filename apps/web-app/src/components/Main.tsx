import { usePostLikeRead, useZkProofOfHumanity, useZkProofOfHumanityRead } from '@/generated/zk-poh-contract'
import { useIsRegisteredInPoH } from '@/hooks/useIsRegisteredInPoH'
import colors from '@/styles/colors'
import { Button, Container, Divider, Flex, HStack, Icon, IconButton, Link, Radio, RadioGroup, Spacer, Stack, Text, useBreakpointValue, useColorModeValue,Box, SimpleGrid } from '@chakra-ui/react'
import { Network, SemaphoreEthers } from '@semaphore-protocol/data'
import { Identity } from '@semaphore-protocol/identity'
import { BigNumber } from "ethers/lib/ethers"
import { formatBytes32String } from 'ethers/lib/utils.js'
import { useContext, useEffect, useState } from 'react'
import { FaGithub } from "react-icons/fa"
import NoSSR from 'react-no-ssr'
import { useAccount, useDisconnect, useNetwork } from 'wagmi'
import { ConnectionState, ConnectionStateType, ZKPoHConnect } from './ZKPoHConnect'
import { ButtonActionState } from '@/widget/ButtonAction'
import LogsContext from '@/context/LogsContext'
import theme from "../styles/index"
import Card from './Card'


export default function Main() {

  const { address, isConnected } = useAccount()

  const { disconnect } = useDisconnect();
  const contract = useZkProofOfHumanity();

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
        setIdentity(state.identity,);
        setAddressIdentity(state.address);
    }
  }

  const { chain } = useNetwork()
  const {isHuman} = useIsRegisteredInPoH({address});

  /////////// IS REGISTERED ACCOUNT
  const {data:groupId}= useZkProofOfHumanityRead({
    functionName: 'groupId',
  });


    /////////// IS REGISTERED ACCOUNT
    const {data:semaphoreAddress}= useZkProofOfHumanityRead({
        functionName: 'semaphore',
      });



  /////////// IS REGISTERED ACCOUNT
  const {data:isRegistered}= useZkProofOfHumanityRead({
    functionName: 'isRegistered',
    args: [!address?"0x00":address], //TODO review
    enabled: address?true:false,
    watch:true
  });

  const {data:message} = usePostLikeRead({
    functionName: 'message',
    enabled: address && chain?.id==1337?true:false,
  });

  const {data:messageId} = usePostLikeRead({
    functionName: 'messageId',
    enabled: address && chain?.id==1337?true:false,
  });

  /////////// IS REGISTERED ENTITY
  const [_addressIdentity, setAddressIdentity] = useState<`0x${string}` | undefined>();
  const {data:isRegisteredIdentity}= useZkProofOfHumanityRead({
        functionName: 'isRegistered',
        args: [!_addressIdentity?"0x00":_addressIdentity], //TODO review
        enabled: _addressIdentity?true:false,
   });

  function shortenAddress(address: string | undefined | any) {
    if(!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const signalCasterConfig= {
   // signal:'LIKE',
    castedMessage:'I liked this message 👍',
    helpText:'Your identity is registered in ZK Proof of Humanity and generated, so now you can like this message.',
  }

  const valueSignalDefault = 'LIKE';
  const [_identity, setIdentity] = useState<Identity>();
  const [likeCount, setLikeCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [optionCastedSelected, setOptionCastedSelected] = useState<string>(valueSignalDefault);

  useEffect(() => {
      async function fetchData() {
          if (!chain) return;
          if (!contract) return;
          const network = chain.network as Network | "localhost";
          console.log(contract.address);
         console.log("groupId:",groupId);
         let semaphoreEthers;
          if ("localhost" == network) {
              semaphoreEthers = new SemaphoreEthers("http://localhost:8545", {
                  address: semaphoreAddress,
              });
          } else {
             semaphoreEthers = new SemaphoreEthers(network);
          }
          if (groupId && network == "localhost") {
              const verifiedProofs = await semaphoreEthers.getGroupVerifiedProofs(groupId.toString());
              console.log(verifiedProofs);

              const result = verifiedProofs.filter((obj:any) => {
                  const signal32Bytes = formatBytes32String(valueSignalDefault);
                  return obj.nullifierHash === messageId?.toString() && BigNumber.from(signal32Bytes).eq(BigNumber.from(obj.signal))
              });
              console.log(result);
              setLikeCount(result.length);
              setTotalCount(verifiedProofs.length)

          }
          return;
      }
      fetchData();
  }, [chain, contract, groupId, messageId, semaphoreAddress]);
   console.log("*** Rendering Main ****")
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
        <Text color='secondaryGray.100' fontSize='md' fontWeight='800'> - <b>Human Address:</b> </Text> <EtherScanLink  address={_addressIdentity}><Text fontSize='md'>{shortenAddress(_addressIdentity)} </Text></EtherScanLink>
        <Text color='secondaryGray.100' fontSize='md' fontWeight='800'> - <b>Identity Commitment:</b> </Text><Text fontSize='md'> {shortenAddress(_identity?.commitment.toString())} </Text>
      </>
    )}
    {isConnected && contract && (
      <Text color='secondaryGray.100' fontWeight='800'>
        {" "}
        | <b>Contract:</b>  <EtherScanLink  address={contract.address}>{shortenAddress(contract.address)}</EtherScanLink>
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

<Container flex="1" display="flex"   maxW={2800} bg={'gray.200'}>
   <SimpleGrid columns={{ base: 1, md: 1, lg: 3, '2xl': 3 }} gap='20px' mb='120px'  mt='120px'>
   <Card  alignItems='left' flexDirection='column' w='100%' mb='0px'>
     <NoSSR>
         <Stack display="flex" width="100%">
         <Text me='auto' color={"secondaryGray.900"} fontSize='xl' fontWeight='700' lineHeight='100%'>
           Contract information:
         </Text>
             <Text>{message}</Text>
             <Text>{shortenAddress(messageId?.toString())}</Text>
         </Stack>
     </NoSSR>
   </Card>
     


     
   <Card justifyContent='center' alignItems='left' flexDirection='column' w='100%' mb='0px'>

   <Stack direction='column' h="100%" >
     <Text me='auto' color={"secondaryGray.900"} fontSize='xl' fontWeight='700' mt='0px' lineHeight='100%'>
           Vote
     </Text>
     <Stack display="flex" width="100%">    
         
       <Stack display="flex" width="100%" height="100%">
             <Text>{helpText}</Text>
           
       </Stack>
       {connectionStateType=='CAST_SIGNAL' &&  (
         <RadioGroup onChange={setOptionCastedSelected} value={optionCastedSelected}>
           <Stack direction='column'>
             <Radio value='LIKE'>I like</Radio>
             <Radio value='NOTLIKE'>I do not like</Radio>
           </Stack>
         </RadioGroup>)}

         
      
         </Stack>
         <Stack alignItems='flex-end' justifyContent='flex-end' h="100%">
         <ZKPoHConnect theme={theme} chain={chain} isConnected={isConnected} isHuman={isHuman}  isRegistered={isRegistered} isRegisteredIdentity={isRegisteredIdentity} onChangeState={handleChangeState} onLog={handleLog} signalCasterConfig={ {signal:optionCastedSelected, externalNullifier: messageId,
    ...signalCasterConfig}}>I like your message</ZKPoHConnect>
   </Stack>
       </Stack>
         </Card>
         <Card justifyContent='center' alignItems='center' flexDirection='column' w='100%' mb='0px'>
         <Text me='auto' color={"secondaryGray.900"} fontSize='xl' fontWeight='700' lineHeight='100%'>
           Result of the vote
         </Text>
         <Stack alignItems='center' justifyContent='center' h="100%" w="50%">
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
                   Like
                 </Text>
               </Flex>
               <Text fontSize='lg' color='secondaryGray.100' fontWeight='900'>
                 63%
               </Text>
             </Flex>
             <Flex direction='column' py='5px' me='10px' w="50%" alignItems='center'>
               <Flex align='center'>
                 <Box h='8px' w='8px' bg='red.600' borderRadius='50%' me='4px' />
                 <Text fontSize='xs' color='secondaryGray.100' fontWeight='700' mb='5px'>
                   Not Like
                 </Text>
               </Flex>
               <Text fontSize='lg' color='secondaryGray.100' fontWeight='900'>
                 25%
               </Text>
             </Flex>
             </Flex>
             <Flex direction='column' alignItems='center'>
               <Text fontSize='lg' color='secondaryGray.100' fontWeight='900'><b>Total vote:</b> {totalCount}</Text>
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
    <Link color={colors.primary[500]} href={`https://goerli.etherscan.io/address/${address}`} isExternal>{children}</Link>
  )
}
