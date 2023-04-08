import { usePostLikeRead, useZkProofOfHumanity, useZkProofOfHumanityRead } from '@/generated/zk-poh-contract'
import { useIsRegisteredInPoH } from '@/hooks/useIsRegisteredInPoH'
import colors from '@/styles/colors'
import { Button, Container, Divider, Flex, HStack, Icon, IconButton, Link, Spacer, Stack, Text, useBreakpointValue, useColorModeValue } from '@chakra-ui/react'
import { Identity } from '@semaphore-protocol/identity'
import { useEffect, useState } from 'react'
import { FaGithub } from "react-icons/fa"
import NoSSR from 'react-no-ssr'
import { useAccount, useDisconnect, useNetwork } from 'wagmi'
import { ZKPoHConnect } from './ZKPoHConnect'


export default function Main() {

  const { address, isConnected } = useAccount()

  const { disconnect } = useDisconnect();
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

  const {data:message} = usePostLikeRead({
    functionName: 'message',
    enabled: address && chain?.name=='localhost'?true:false,
  });

  const {data:messageId} = usePostLikeRead({
    functionName: 'messageId',
    enabled: address && chain?.name=='localhost'?true:false,
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

  const signalCasterConfig= {
    signal:'LIKE',
    castedMessage:'I liked this message 👍',
    helpText:'Your identity is registered in ZK Proof of Humanity and generated, so now you can like this message.'
  }
  const [_identity, setIdentity] = useState<Identity>();

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
           <NoSSR>
                <Stack display="flex" width="100%">
                    <Text align="center">{message}</Text>
                    <Text align="center">{shortenAddress(messageId?.toString())}</Text>
                    <Divider/>
                </Stack>
            </NoSSR>
            <ZKPoHConnect chain={chain} isConnected={isConnected} isHuman={isHuman} identity={_identity} isRegistered={isRegistered} isRegisteredIdentity={isRegisteredIdentity} handleNewIdentity={handleNewIdentity} signalCasterConfig={ { externalNullifier: messageId,
    ...signalCasterConfig}}>I like your message</ZKPoHConnect>
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
