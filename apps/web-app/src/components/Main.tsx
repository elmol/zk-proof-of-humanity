import { usePostLikeRead, useZkProofOfHumanity, useZkProofOfHumanityRead } from '@/generated/zk-poh-contract'
import { useIsRegisteredInPoH } from '@/hooks/useIsRegisteredInPoH'
import colors from '@/styles/colors'
import { Button, Container, Divider, Flex, HStack, Icon, IconButton, Link, Radio, RadioGroup, Spacer, Stack, Text, useBreakpointValue, useColorModeValue } from '@chakra-ui/react'
import { Network, SemaphoreEthers } from '@semaphore-protocol/data'
import { Identity } from '@semaphore-protocol/identity'
import { BigNumber } from "ethers/lib/ethers"
import { formatBytes32String } from 'ethers/lib/utils.js'
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

  const [connectionState, setConnectionState] = useState('Not_Initialized')

  function handleChangeState(state:string) {
    setConnectionState(state);
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
          if (groupId) {
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

           {connectionState=='CAST_SIGNAL' &&  (
            <RadioGroup onChange={setOptionCastedSelected} value={optionCastedSelected}>
              <Stack direction='column'>
                <Radio value='LIKE'>I like</Radio>
                <Radio value='NOTLIKE'>I do not like</Radio>
              </Stack>
            </RadioGroup>)}


            <ZKPoHConnect chain={chain} isConnected={isConnected} isHuman={isHuman} identity={_identity} isRegistered={isRegistered} isRegisteredIdentity={isRegisteredIdentity} handleNewIdentity={handleNewIdentity} onChangeState={handleChangeState} signalCasterConfig={ {signal:optionCastedSelected, externalNullifier: messageId,
    ...signalCasterConfig}}>I like your message</ZKPoHConnect>
          <Text fontSize="xs" align='center'>connection state: {connectionState}</Text>
          <Text><b>Likes/Total:</b> {likeCount}/{totalCount}</Text>
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
