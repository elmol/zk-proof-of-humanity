import LogsContext from '@/context/LogsContext'
import { useZkProofOfHumanity, useZkProofOfHumanityRead } from '@/generated/zk-poh-contract'
import { useIsRegisteredInPoH } from '@/hooks/useIsRegisteredInPoH'
import colors from '@/styles/colors'
import { Box, Button, ChakraProvider, Container, Divider, Flex, HStack, Icon, IconButton, Link, Spacer, Stack, Text, Tooltip, useBreakpointValue, useColorModeValue } from '@chakra-ui/react'
import { Identity } from '@semaphore-protocol/identity'
import { useContext, useState } from 'react'
import { FaGithub } from "react-icons/fa"
import NoSSR from 'react-no-ssr'
import { useAccount, useDisconnect, useNetwork } from 'wagmi'
import theme from "../styles/index"

import { ButtonActionState, ConnectionState, ZKPoHConnect } from 'zkpoh-button'
import { ethers } from 'ethers'


export default function Main() {

  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect();

  const externalNullifier =  randomNullifier();
  const signal = "I'm human";


  const contract = useZkProofOfHumanity();
  function handleNewIdentity({identity,address} : {identity: Identity, address:`0x${string}`}):void {
    setIdentity(identity);
    setAddressIdentity(address);
  }

  const { chain } = useNetwork()
  const {isHuman} = useIsRegisteredInPoH({address});

  /////////// IS REGISTERED ACCOUNT
  const {data:isRegistered}= useZkProofOfHumanityRead({
    functionName: 'isRegistered',
    args: [!address?"0x00":address], //TODO review
    enabled: address?true:false,
    watch:true
  });

  /////////// IS REGISTERED ENTITY
  const [_addressIdentity, setAddressIdentity] = useState<`0x${string}` | undefined>();
  const {data:isRegisteredIdentity}= useZkProofOfHumanityRead({
        functionName: 'isRegistered',
        args: [!_addressIdentity?"0x00":_addressIdentity], //TODO review
        enabled: _addressIdentity?true:false,
        watch:true
   });

  function shortenAddress(address: string | undefined | any) {
    if(!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }


  const [_identity, setIdentity] = useState<Identity>();

  const { setLogs } = useContext(LogsContext);
  function handleLog(state: ButtonActionState) {
      setLogs(state.logs);
  }

  const [helpText, setHelpText] = useState<string>();
  function handleChangeState(state:ConnectionState) {
    setHelpText(state.helpText);
    if(state.stateType=='IDENTITY_GENERATED'){
        setIdentity(state.identity,);
        setAddressIdentity(state.address);
    }
  }

   return (
     <>
       <NoSSR>
         <HStack align="center" justify="right" borderBottom="1px solid #8f9097" px={{ base: 4 }}>
           <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
             <Text textAlign={useBreakpointValue({ base: "center", md: "left" })} fontFamily={"heading"} color={useColorModeValue("gray.800", "white")}>
               🎭 <b>ZK Proof of Humanity </b>
               <Link href="https://github.com/elmol/zk-proof-of-humanity" isExternal>
                  <IconButton aria-label="Github repository" icon={<Icon boxSize={6} as={FaGithub} />} />
               </Link>
             </Text>
           </Flex>
           <Spacer></Spacer>
           {_identity && _addressIdentity && (
             <>
               <Text >
                 | <b>🔒 Identity:</b>
               </Text>
               <Text fontSize='md'> - <b>Human Address:</b> </Text> <EtherScanLink  address={_addressIdentity}><Text fontSize='md'>{shortenAddress(_addressIdentity)} </Text></EtherScanLink>
               <Text fontSize='md'> - <b>Identity Commitment:</b> </Text><Text fontSize='md'> {shortenAddress(_identity?.commitment.toString())} </Text>
             </>
           )}
           {isConnected && contract && (
             <Text>
               {" "}
               | <b>Contract:</b>  <EtherScanLink  address={contract.address}>{shortenAddress(contract.address)}</EtherScanLink>
             </Text>
           )}
          {chain && <Text> | <b>Network:</b> {chain.unsupported?"Wrong Network":chain.name}</Text>}
           {isConnected && address && (
             <>
               <Text>
                 {" "}
                 | <b>Connected to </b> <EtherScanLink  address={address}>{shortenAddress(address)}</EtherScanLink> {isHuman ? "🧑" : "🤖"} |{" "}
               </Text>{" "}
               <Button colorScheme="primary" size="xs" onClick={() => disconnect()}>
                 Disconnect
               </Button>
             </>
           )}
         </HStack>
       </NoSSR>

       <Container maxW="sm" flex="1" display="flex" alignItems="center" mb="10%">
         <Stack display="flex" width="100%">
            <Text pt="2" fontSize="md" textAlign="justify">
                {helpText}
            </Text>
            <Divider pt="1" borderColor="gray.500" />
            <ZKPoHConnect theme={theme} onChangeState={handleChangeState} onLog={handleLog} signal={signal} externalNullifier={externalNullifier}>Verify</ZKPoHConnect>
            <Divider pt="1" borderColor="gray.500" />
            <
                ChakraProvider theme={theme}>
                  <Tooltip label={helpText} placement="bottom-start">
                    <Box alignItems="center">
                        <ChakraProvider theme={theme}>
                                <Button colorScheme='primary' width="100%">TEST</Button>
                        </ChakraProvider>
                    </Box>
                  </Tooltip>
            </ChakraProvider>


            <Divider pt="1" borderColor="gray.500" />
            <ChakraProvider theme={theme}>
            <Text pt="2" fontSize="md" textAlign="justify">
                {helpText}
            </Text>
            <Divider pt="1" borderColor="gray.500" />
            <Button colorScheme="primary"> Connect Wallet </Button>
            </ChakraProvider>
         </Stack>
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

function randomNullifier() {
    return ethers.BigNumber.from(ethers.utils.randomBytes(32));
}
