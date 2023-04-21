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

export interface ZKPoHAction extends ConnectionState {
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



export function ZKPoHConnect(props: ZKPoHConnectProps) {

    const { isConnected, chain, isHuman, isRegistered, isRegisteredIdentity, onChangeState, children, signalCasterConfig, onLog: onStateChange, theme} = props;

    const IdentityGeneration = logger<NewIdentityProps>(IdentityGenerator);
    const Registration = logger<RegisterProps>(Register);
    const Verification = logger<ProverProps>(Prover);
    const WalletSwitchAccount = logger(WalletAccountSwitcher);
    const WalletSwitchChain = logger(WalletChainSwitcher);
    const WalletConnection = logger(WalletConnect);

    const [identity, setIdentity] = useState<Identity>();

  const isCastSignal = useCallback(() => {
    return isConnected && !chain?.unsupported && !isHuman && identity && isRegisteredIdentity
  }, [chain?.unsupported, identity, isConnected, isHuman, isRegisteredIdentity]);

  const isIdentityGeneration = useCallback(() => {
    return isConnected && !chain?.unsupported && isHuman && !identity
  }, [chain?.unsupported, identity, isConnected, isHuman]);


  const isConnect = useCallback(() => {
    return !isConnected
  }, [isConnected]);

  const isChangeNetwork = useCallback(() => {
    return isConnected && chain?.unsupported
  }, [chain?.unsupported, isConnected]);

  const isRegistration = useCallback(() => {
    return isHuman && identity && !isRegistered
  }, [identity, isHuman, isRegistered]);

  const isReconnectionBurnerAccount = useCallback(() => {
    return isConnected && !chain?.unsupported && isHuman && identity && isRegistered
  }, [chain?.unsupported, identity, isConnected, isHuman, isRegistered]);

  const isReconnectionHumanAccount = useCallback(() => {
    return isConnected && !chain?.unsupported && !isHuman && !identity
  }, [chain?.unsupported, identity, isConnected, isHuman]);

  const isReconnectionHumanRegeneratePrivateIdentity = useCallback(() => {
    return isConnected && !chain?.unsupported && !isHuman && identity && !isRegisteredIdentity
  }, [chain?.unsupported, identity, isConnected, isHuman, isRegisteredIdentity]);

  const getConnectionState = useCallback(():ZKPoHAction =>{

    function handleNewIdentity({ identity, address }: { identity: Identity, address: `0x${string}` }): void {
      const state: ConnectionState = { stateType: 'IDENTITY_GENERATED', identity, address }
      onChangeState(state);
      setIdentity(identity);
    }

    const connectState:ZKPoHAction = {
      stateType: 'INITIALIZED',
      helpText: CONNECT_HELP_TEXT,
      component:  <WalletConnection/>
    };
    const changeNetworkState:ZKPoHAction  = {
      stateType: 'INITIALIZED', helpText: CHANGE_NETWORK_HELP_TEXT,
      component: <WalletSwitchChain/>
    };
    const registrationState:ZKPoHAction  = {
      stateType: 'INITIALIZED', helpText: REGISTRATION_HELP_TEXT,
      component: identity?<Registration identity={identity} />: <Box>DEFAULT</Box>
    };
    const identityGenerationState:ZKPoHAction  = {
      stateType: 'IDENTITY_GENERATION', helpText: IDENTITY_GENERATION_HELP_TEXT,
      component: <IdentityGeneration handleNewIdentity={handleNewIdentity} />
    };
    const burnerAccountState:ZKPoHAction  = {
      stateType: 'INITIALIZED', helpText: BURNER_ACCOUNT_RECONNECTION,
      component: <WalletSwitchAccount/>
    };
    const humanAccountState:ZKPoHAction  = {
      stateType: 'INITIALIZED', helpText: HUMAN_ACCOUNT_HELP_TEXT,
      component: <WalletSwitchAccount/>
    };
    const humanRegenerationState:ZKPoHAction  = {
      stateType: 'INITIALIZED', helpText: IDENTITY_REGENERATION_HELP_TEXT,
      component: <WalletSwitchAccount/>
    };
    const castSignalState:ZKPoHAction  = {
      stateType: 'CAST_SIGNAL', helpText: signalCasterConfig.helpText,
      component: identity?<Verification identity={identity} signal={signalCasterConfig.signal} externalNullifier={signalCasterConfig.externalNullifier} verificationMessage={signalCasterConfig.castedMessage}>{children}</Verification>:<Box>DEFAULT</Box>
    };
    const defaultState:ZKPoHAction  = {
      stateType: 'INITIALIZED', helpText: DEFAULT_HELP_TEXT,
      component: <Box>DEFAULT</Box>
    };

    if (isConnect()) {
        return connectState;
    }
    if (isChangeNetwork()) {
        return changeNetworkState;
    }
    if (isRegistration()) {
        return registrationState;
    }
    if (isCastSignal()) {
        return castSignalState;
    }
    if (isIdentityGeneration()) {
        return identityGenerationState;
    }
    if (isReconnectionBurnerAccount()) {
        return burnerAccountState;
    }
    if (isReconnectionHumanAccount()) {
        return humanAccountState;
    }
    if (isReconnectionHumanRegeneratePrivateIdentity()) {
        return humanRegenerationState;
    }
    return defaultState;

  },[IdentityGeneration, Registration, Verification, WalletConnection, WalletSwitchAccount, WalletSwitchChain, children, identity, isCastSignal, isChangeNetwork, isConnect, isIdentityGeneration, isReconnectionBurnerAccount, isReconnectionHumanAccount, isReconnectionHumanRegeneratePrivateIdentity, isRegistration, onChangeState, signalCasterConfig.castedMessage, signalCasterConfig.externalNullifier, signalCasterConfig.helpText, signalCasterConfig.signal])

  const getStateHelpText = useCallback((): string => {
     return getConnectionState().helpText || DEFAULT_HELP_TEXT
  },[getConnectionState])

  useEffect(() => {
    const state = getConnectionState();
    onChangeState(state)
  }, [getConnectionState, onChangeState])

  function reconnection() {
    const component = getConnectionState().component;
    const textArea = getStateHelpText();
    return wrapper(textArea, component);
  }

  function connect() {
    const textArea = getStateHelpText();
    const component = getConnectionState().component;
    return wrapper(textArea, component);
  }

  function changeNetwork() {
    const textArea = getStateHelpText();
    const component = getConnectionState().component;
    return wrapper(textArea, component);
  }

  function verification() {
    if (!identity) {
      return;
    }
    const textArea = getStateHelpText();
    const component = getConnectionState().component;
    return wrapper(textArea, component);
  }

  function registration() {
    if (!identity) {
      return;
    }
    const textArea = getStateHelpText();
    const component = getConnectionState().component;
    return wrapper(textArea, component);
  }

  function identityGeneration() {
    const component = getConnectionState().component;
    const textArea = getStateHelpText();
    return wrapper(textArea, component);
  }


 function logger<T extends ButtonActionProps>(Component: ComponentType<T>) {
     return function ExtendedComponent(innerProps: T) {
         function handleStateChange(state: ButtonActionState) {
             onStateChange && onStateChange(state);
         }
         return <Component {...innerProps} theme={theme} onStateChange={handleStateChange} />;
     };
 }


  function wrapper(textArea: string, component: JSX.Element) {
    return (
        <>
            <Tooltip label={textArea} placement="bottom-start">
                <Box alignItems="center">{component}</Box>
            </Tooltip>
        </>
    );
  }

  return (
    <>
      <NoSSR>
        {isChangeNetwork() && changeNetwork()}
        {isConnected && !chain?.unsupported && (
          <>
            {isIdentityGeneration() && identityGeneration()}
            {isRegistration() && registration()}
            {isReconnectionBurnerAccount() &&
              reconnection()}
            {isReconnectionHumanAccount() &&  reconnection()}
            {isReconnectionHumanRegeneratePrivateIdentity () && reconnection()}
            {isCastSignal() && verification()}
          </>
        )}
        {isConnect() && connect()}
      </NoSSR>
    </>
  );
}
