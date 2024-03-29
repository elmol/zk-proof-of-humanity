import { useIsRegisteredInPoH, useZkProofOfHumanityRead } from "../hooks";
import WalletConnect from "./WalletConnect";
import WalletChainSwitcher from "./WalletChainSwitcher";
import WalletAccountSwitcher from "./WalletAccountSwitcher";
import { IdentityGenerator } from "./IdentityGenerator";
import { Register } from "./Register";
import { Prover } from "./Prover";
import { ButtonActionState } from "./ButtonAction";


import { Box, Tooltip, ChakraProvider } from "@chakra-ui/react";
import { Dict } from "@chakra-ui/utils";
import { Identity } from "@semaphore-protocol/identity";
import { BigNumber } from "ethers";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import NoSSR from "react-no-ssr";

const CONNECT_HELP_TEXT = "To interact with ZK Proof of Humanity, you'll need to connect to a wallet that supports this feature. Please ensure that you are connected to Metamask before proceeding.";
const CHANGE_NETWORK_HELP_TEXT = "You are currently connected to a wrong network. To interact with ZK Proof of Humanity, you'll need to change to supported network. Please switch to Goerli network.";
const REGISTRATION_HELP_TEXT = "You're using a human account registered in Proof of Humanity, but this account is not registered in ZK Proof of Humanity. To continue, please register it.";
const IDENTITY_GENERATION_HELP_TEXT = "You are currently connected with a human account, but no private identity has been set up for this account yet. Please generate a private identity by signing the provided message.";
const BURNER_ACCOUNT_RECONNECTION = "Your human account is registered in ZK Proof of Humanity and you've generated the private identity. Now, connect with a burner account to signal.";
const HUMAN_ACCOUNT_HELP_TEXT = "You are not currently connected with an account registered in Proof of Humanity. To generate your identity and proceed, please connect with a human account.";
const IDENTITY_REGENERATION_HELP_TEXT = "The private identity is not registered in ZK Proof of Humanity. Please connect with a registered human account to regenerate your private identity and proceed.";
const SIGNALING_HELP_TEXT = "Your identity is registered in ZK Proof of Humanity and it was generated, so you can cast a signal."
const DEFAULT_HELP_TEXT = "Default help text";
const DEFAULT_CONFIRMATION_MESSAGE = "You have successfully signaled 🎉"

export type ConnectionStateType = "CAST_SIGNAL" | "IDENTITY_GENERATION" | "IDENTITY_GENERATED" | "INITIALIZED";

export type ConnectionState = {
  stateType: ConnectionStateType
  helpText?: string,
  identity?: Identity,
  address?: `0x${string}`
}

export interface ZKPoHAction {
    state:ConnectionState
    component: JSX.Element
}

export interface ZKPoHConnectProps  {
  externalNullifier: BigNumber | undefined,
  signal: string,
  children: ReactNode,
  theme?: Dict | undefined,
  confirmationMessage?: string,
  helpText?: string,
  contractAddress?:`0x${string}` | undefined;
  onChangeState?: (state: ConnectionState) => void,
  onLog?: (state: ButtonActionState) => void,
};

interface InputState {
    isConnected?:boolean,
    isSupportedChain?:boolean,
    isHuman?:boolean,
    isIdentityGenerated?:boolean,
    isRegistered?:boolean,
    isRegisteredIdentity?:boolean
}

export function ZKPoHConnect(props: ZKPoHConnectProps) {

    const { onChangeState, onLog, children, externalNullifier, signal, confirmationMessage, helpText, theme, contractAddress } = props;

    const { address, isConnected } = useAccount()
    const { chain } = useNetwork()
    const {isHuman} = useIsRegisteredInPoH({address, contractAddress});
    const {data:isRegistered}= useZkProofOfHumanityRead({
        contractAddress: contractAddress,
        functionName: 'isRegistered',
        args: [!address?"0x00":address], //TODO review
        enabled: address?true:false,
        watch:true
    });


  /////////// IS REGISTERED ENTITY
  const [_addressIdentity, setAddressIdentity] = useState<`0x${string}` | undefined>();
  const {data:isRegisteredIdentity}= useZkProofOfHumanityRead({
        contractAddress: contractAddress,
        functionName: 'isRegistered',
        args: [!_addressIdentity?"0x00":_addressIdentity], //TODO review
        enabled: _addressIdentity?true:false,
   });


    const [identity, setIdentity] = useState<Identity>();
    const isSupportedChain =!chain?.unsupported;


  const getAction = useCallback((input:InputState):ZKPoHAction =>{

    function handleStateChange(state: ButtonActionState) {
        onLog && onLog(state);
    }

    const {isConnected, isSupportedChain, isHuman , isIdentityGenerated , isRegistered, isRegisteredIdentity } = input;

    function handleNewIdentity({ identity, address }: { identity: Identity, address: `0x${string}` }): void {
      const state: ConnectionState = { stateType: 'IDENTITY_GENERATED', identity, address }
      onChangeState && onChangeState(state);
      setIdentity(identity);
      setAddressIdentity(state.address);
    }

    // is not connected return connect button
    const isConnect = !isConnected;
    const connectState: ZKPoHAction = {state: {stateType: "INITIALIZED", helpText: CONNECT_HELP_TEXT}, component: <WalletConnect theme={theme} onStateChange={handleStateChange}/> };
    if (isConnect) return connectState;

    // is not supported network return network switcher
    const isChangeNetwork = isConnected && !isSupportedChain;
    const changeNetworkState:ZKPoHAction  = {state: {stateType: 'INITIALIZED', helpText: CHANGE_NETWORK_HELP_TEXT}, component: <WalletChainSwitcher theme={theme} onStateChange={handleStateChange}/>};
    if (isChangeNetwork) return changeNetworkState;

    // is not connected with a human account and the identity was not generated return human account reconnection
    const isReconnectionHumanAccount = isConnected && isSupportedChain && !isHuman && !isIdentityGenerated;
    const humanAccountState:ZKPoHAction  = {state: {stateType: 'INITIALIZED', helpText: HUMAN_ACCOUNT_HELP_TEXT}, component: <WalletAccountSwitcher theme={theme} onStateChange={handleStateChange}/>};
    if (isReconnectionHumanAccount) return humanAccountState;

    // is connected with human account but the identity was not generated return identity generator
    const isIdentityGeneration = isConnected && isSupportedChain && isHuman && !isIdentityGenerated;
    const identityGenerationState:ZKPoHAction  = {state: {stateType: 'IDENTITY_GENERATION', helpText: IDENTITY_GENERATION_HELP_TEXT}, component: <IdentityGenerator handleNewIdentity={handleNewIdentity} theme={theme} onStateChange={handleStateChange} />};
    if (isIdentityGeneration) return identityGenerationState;

    // is connected with human account the identity was generated but not registered return registration
    const isRegistration = isConnected && isSupportedChain && isHuman && isIdentityGenerated && !isRegistered;
    const registrationState:ZKPoHAction  = {state: {stateType: 'INITIALIZED', helpText: REGISTRATION_HELP_TEXT}, component: identity?<Register identity={identity} theme={theme} contractAddress={contractAddress} onStateChange={handleStateChange}/>: <Box>DEFAULT</Box>};
    if (isRegistration) return registrationState;

    // is connected with human account and ready to signal return burner account reconnection
    const isReconnectionBurnerAccount = isConnected && isSupportedChain && isHuman && isIdentityGenerated && isRegistered;
    const burnerAccountState:ZKPoHAction  = { state: {stateType: 'INITIALIZED', helpText: BURNER_ACCOUNT_RECONNECTION}, component: <WalletAccountSwitcher theme={theme} onStateChange={handleStateChange}/>};
    if (isReconnectionBurnerAccount) return burnerAccountState;

    // is not a registered identity generated return regenerate identity
    const isReconnectionHumanRegeneratePrivateIdentity =isConnected && isSupportedChain && !isHuman && isIdentityGenerated && !isRegisteredIdentity;
    const humanRegenerationState:ZKPoHAction  = { state: {stateType: 'INITIALIZED', helpText: IDENTITY_REGENERATION_HELP_TEXT}, component: <WalletAccountSwitcher theme={theme} onStateChange={handleStateChange}/> };
    if (isReconnectionHumanRegeneratePrivateIdentity) return humanRegenerationState;

    // is ready to cast signal return signal caster
    const isCastSignal = isConnected && isSupportedChain && !isHuman && isIdentityGenerated && isRegisteredIdentity;
    const castSignalState:ZKPoHAction  = {
        state: {stateType: 'CAST_SIGNAL', helpText: helpText || SIGNALING_HELP_TEXT },
        component: identity?<Prover identity={identity} signal={signal} externalNullifier={externalNullifier} verificationMessage={confirmationMessage|| DEFAULT_CONFIRMATION_MESSAGE} theme={theme} contractAddress={contractAddress} onStateChange={handleStateChange}>{children}</Prover>:<Box>DEFAULT</Box>
      };
    if (isCastSignal) return castSignalState;

    // return default stage, never should be returned
    const defaultState:ZKPoHAction  = {state: {stateType: 'INITIALIZED', helpText: DEFAULT_HELP_TEXT},component: <Box>DEFAULT</Box>};
    return defaultState;
  },[theme, identity, helpText, signal, externalNullifier, confirmationMessage, children, onLog, onChangeState])



  useEffect(() => {
    if(!onChangeState) return
    const isIdentityGenerated = identity?true:false;
    const action = getAction({isConnected, isSupportedChain, isHuman , isIdentityGenerated , isRegistered, isRegisteredIdentity});
    onChangeState(action.state)
  }, [getAction, identity, isConnected, isHuman, isRegistered, isRegisteredIdentity, isSupportedChain, onChangeState])

  const isIdentityGenerated = identity?true:false;
  const {component, state } = getAction({isConnected, isSupportedChain, isHuman , isIdentityGenerated , isRegistered, isRegisteredIdentity});
  return (
      <>
          <NoSSR>
              <ChakraProvider theme={props.theme}>
                  <Tooltip label={state.helpText || DEFAULT_HELP_TEXT} placement="bottom-start">
                      <Box alignItems="center">{component}</Box>
                  </Tooltip>
              </ChakraProvider>
          </NoSSR>
      </>
  );
}
