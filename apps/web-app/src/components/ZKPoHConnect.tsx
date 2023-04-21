import { Box, Tooltip } from "@chakra-ui/react";
import { Dict } from "@chakra-ui/utils";
import { Identity } from "@semaphore-protocol/identity";
import { BigNumber } from "ethers";
import { ComponentType, ReactNode, useCallback, useEffect, useState } from "react";
import NoSSR from "react-no-ssr";
import { Chain } from "wagmi";
import { ButtonActionProps, ButtonActionState, IdentityGenerator, NewIdentityProps, Prover, ProverProps, Register, RegisterProps, WalletAccountSwitcher, WalletChainSwitcher, WalletConnect } from "zkpoh-button";

const CONNECT_HELP_TEXT = "To interact with ZK Proof of Humanity, you'll need to connect to a wallet that supports this feature. Please ensure that you are connected to Metamask before proceeding.";
const CHANGE_NETWORK_HELP_TEXT = "You are currently connected to a wrong network. To interact with ZK Proof of Humanity, you'll need to change to supported network. Please switch to Goerli network.";
const REGISTRATION_HELP_TEXT = "You're using a human account registered in Proof of Humanity, but this account is not registered in ZK Proof of Humanity. To continue, please register it.";
const IDENTITY_GENERATION_HELP_TEXT = "You are currently connected with a human account, but no private identity has been set up for this account yet. Please generate a private identity by signing the provided message.";
const BURNER_ACCOUNT_RECONNECTION = "Your human account is registered in ZK Proof of Humanity and you've generated the private identity. Now, connect with a burner account to signal.";
const HUMAN_ACCOUNT_HELP_TEXT = "You are not currently connected with an account registered in Proof of Humanity. To generate your identity and proceed, please connect with a human account.";
const IDENTITY_REGENERATION_HELP_TEXT = "The private identity is not registered in ZK Proof of Humanity. Please connect with a registered human account to regenerate your private identity and proceed.";
const DEFAULT_HELP_TEXT = "Default help text";


type ChainState =
  | (Chain & {
    unsupported?: boolean | undefined;
  })
  | undefined;

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
  isConnected: boolean,
  chain: ChainState,
  isHuman: boolean | undefined,
  isRegistered: boolean | undefined,
  isRegisteredIdentity: boolean | undefined,
  children: ReactNode,
  theme?: Dict | undefined,
  signalCasterConfig: {
    externalNullifier: BigNumber | undefined,
    signal: string,
    castedMessage: string,
    helpText: string
  }
  onChangeState: (state: ConnectionState) => void,
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

    const { isConnected, chain, isHuman, isRegistered, isRegisteredIdentity, onChangeState, onLog, children, signalCasterConfig, theme} = props;
    const [identity, setIdentity] = useState<Identity>();
    const isSupportedChain =!chain?.unsupported;


  const getAction = useCallback((input:InputState):ZKPoHAction =>{

    function logger<T extends ButtonActionProps>(Component: ComponentType<T>) {
        return function ExtendedComponent(innerProps: T) {
            function handleStateChange(state: ButtonActionState) {
                onLog && onLog(state);
            }
            return <Component {...innerProps} theme={theme} onStateChange={handleStateChange} />;
        };
    }

    const IdentityGeneration = logger<NewIdentityProps>(IdentityGenerator);
    const Registration = logger<RegisterProps>(Register);
    const Verification = logger<ProverProps>(Prover);
    const WalletSwitchAccount = logger(WalletAccountSwitcher);
    const WalletSwitchChain = logger(WalletChainSwitcher);
    const WalletConnection = logger(WalletConnect);

    const {isConnected, isSupportedChain, isHuman , isIdentityGenerated , isRegistered, isRegisteredIdentity } = input;

    function handleNewIdentity({ identity, address }: { identity: Identity, address: `0x${string}` }): void {
      const state: ConnectionState = { stateType: 'IDENTITY_GENERATED', identity, address }
      onChangeState(state);
      setIdentity(identity);
    }

    // is not connected return connect button
    const isConnect = !isConnected;
    const connectState: ZKPoHAction = {state: {stateType: "INITIALIZED", helpText: CONNECT_HELP_TEXT}, component: <WalletConnection /> };
    if (isConnect) return connectState;

    // is not supported network return network switcher
    const isChangeNetwork = isConnected && !isSupportedChain;
    const changeNetworkState:ZKPoHAction  = {state: {stateType: 'INITIALIZED', helpText: CHANGE_NETWORK_HELP_TEXT}, component: <WalletSwitchChain/>};
    if (isChangeNetwork) return changeNetworkState;

    // is not connected with a human account and the identity was not generated return human account reconnection
    const isReconnectionHumanAccount = isConnected && isSupportedChain && !isHuman && !isIdentityGenerated;
    const humanAccountState:ZKPoHAction  = {state: {stateType: 'INITIALIZED', helpText: HUMAN_ACCOUNT_HELP_TEXT}, component: <WalletSwitchAccount/>};
    if (isReconnectionHumanAccount) return humanAccountState;

    // is connected with human account but the identity was not generated return identity generator
    const isIdentityGeneration = isConnected && isSupportedChain && isHuman && !isIdentityGenerated;
    const identityGenerationState:ZKPoHAction  = {state: {stateType: 'IDENTITY_GENERATION', helpText: IDENTITY_GENERATION_HELP_TEXT}, component: <IdentityGeneration handleNewIdentity={handleNewIdentity} />};
    if (isIdentityGeneration) return identityGenerationState;

    // is connected with human account the identity was generated but not registered return registration
    const isRegistration = isConnected && isSupportedChain && isHuman && isIdentityGenerated && !isRegistered;
    const registrationState:ZKPoHAction  = {state: {stateType: 'INITIALIZED', helpText: REGISTRATION_HELP_TEXT}, component: identity?<Registration identity={identity} />: <Box>DEFAULT</Box>};
    if (isRegistration) return registrationState;

    // is connected with human account and ready to signal return burner account reconnection
    const isReconnectionBurnerAccount = isConnected && isSupportedChain && isHuman && isIdentityGenerated && isRegistered;
    const burnerAccountState:ZKPoHAction  = { state: {stateType: 'INITIALIZED', helpText: BURNER_ACCOUNT_RECONNECTION}, component: <WalletSwitchAccount/>};
    if (isReconnectionBurnerAccount) return burnerAccountState;

    // is not a registered identity generated return regenerate identity
    const isReconnectionHumanRegeneratePrivateIdentity =isConnected && isSupportedChain && !isHuman && isIdentityGenerated && !isRegisteredIdentity;
    const humanRegenerationState:ZKPoHAction  = { state: {stateType: 'INITIALIZED', helpText: IDENTITY_REGENERATION_HELP_TEXT}, component: <WalletSwitchAccount/> };
    if (isReconnectionHumanRegeneratePrivateIdentity) return humanRegenerationState;

    // is ready to cast signal return signal caster
    const isCastSignal = isConnected && isSupportedChain && !isHuman && isIdentityGenerated && isRegisteredIdentity;
    const castSignalState:ZKPoHAction  = {
        state: {stateType: 'CAST_SIGNAL', helpText: signalCasterConfig.helpText},
        component: identity?<Verification identity={identity} signal={signalCasterConfig.signal} externalNullifier={signalCasterConfig.externalNullifier} verificationMessage={signalCasterConfig.castedMessage}>{children}</Verification>:<Box>DEFAULT</Box>
      };
    if (isCastSignal) return castSignalState;

    // return default stage, never should be returned
    const defaultState:ZKPoHAction  = {state: {stateType: 'INITIALIZED', helpText: DEFAULT_HELP_TEXT},component: <Box>DEFAULT</Box>};
    return defaultState;
  },[children, identity, onChangeState, onLog, signalCasterConfig.castedMessage, signalCasterConfig.externalNullifier, signalCasterConfig.helpText, signalCasterConfig.signal, theme])

  useEffect(() => {
    const isIdentityGenerated = identity?true:false;
    const action = getAction({isConnected, isSupportedChain, isHuman , isIdentityGenerated , isRegistered, isRegisteredIdentity});
    onChangeState(action.state)
  }, [getAction, identity, isConnected, isHuman, isRegistered, isRegisteredIdentity, isSupportedChain, onChangeState])



  const isIdentityGenerated = identity?true:false;
  const {component, state } = getAction({isConnected, isSupportedChain, isHuman , isIdentityGenerated , isRegistered, isRegisteredIdentity});
  return (
      <>
          <NoSSR>
              <Tooltip label={state.helpText || DEFAULT_HELP_TEXT} placement="bottom-start">
                  <Box alignItems="center">{component}</Box>
              </Tooltip>
          </NoSSR>
      </>
  );

}


