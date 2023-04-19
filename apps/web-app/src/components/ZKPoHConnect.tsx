import { Box, Divider, Text, Tooltip } from "@chakra-ui/react";
import { Identity } from "@semaphore-protocol/identity";
import { BigNumber, ethers } from "ethers";
import NoSSR from "react-no-ssr";
import { Chain } from "wagmi";
import { IdentityGeneration } from "./IdentityGeneration";
import { WalletConnection } from "./WalletConnection";
import { WalletSwitchAccount } from "./WalletSwitchAccount";
import { WalletSwitchChain } from "./WalletSwtichChain";
import { ReactNode, useCallback, useEffect,useState } from "react";
import { Verification } from "./Verification";
import { Registration } from "./Registration";

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

type Props = {
  isConnected: boolean;
  chain: ChainState;
  isHuman: boolean | undefined;
  isRegistered: boolean | undefined;
  isRegisteredIdentity: boolean | undefined;
  children: ReactNode;
  signalCasterConfig: {
    externalNullifier: BigNumber | undefined,
    signal: string,
    castedMessage: string,
    helpText: string
  }
  onChangeState: (state: ConnectionState) => void;
};



export function ZKPoHConnect({ isConnected, chain, isHuman, isRegistered, isRegisteredIdentity, onChangeState, children, signalCasterConfig }: Props) {

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



  const getStateType = useCallback((): ConnectionStateType => {
    if (isCastSignal()) {
      return "CAST_SIGNAL"
    }

    if (isIdentityGeneration()) {
      return "IDENTITY_GENERATION"
    }

    return "INITIALIZED"
  }, [isCastSignal, isIdentityGeneration]);


  const getStateHelpText = useCallback((): string => {
    if(isConnect()){
      return "To interact with ZK Proof of Humanity, you'll need to connect to a wallet that supports this feature. Please ensure that you are connected to Metamask before proceeding.";
    }
    if(isChangeNetwork()){
      return "You are currently connected to a wrong network. To interact with ZK Proof of Humanity, you'll need to change to supported network. Please switch to Goerli network."
    }
    if(isRegistration()){
      return "You're using a human account registered in Proof of Humanity, but this account is not registered in ZK Proof of Humanity. To continue, please register it."
    }
    if(isCastSignal()){
      return signalCasterConfig.helpText;
    }
    if(isIdentityGeneration()){
      return "You are currently connected with a human account, but no private identity has been set up for this account yet. Please generate a private identity by signing the provided message.";
    }
    if(isReconnectionBurnerAccount()){
      return "Your human account is registered in ZK Proof of Humanity and you've generated the private identity. Now, connect with a burner account to signal.";
    }
    if(isReconnectionHumanAccount()){
      return "You are not currently connected with an account registered in Proof of Humanity. To generate your identity and proceed, please connect with a human account.";
    }
    if(isReconnectionHumanRegeneratePrivateIdentity()){
      return "The private identity is not registered in ZK Proof of Humanity. Please connect with a registered human account to regenerate your private identity and proceed.";
    }
    return "Default help text"
  },[isCastSignal, isChangeNetwork, isConnect, isIdentityGeneration, isReconnectionBurnerAccount, isReconnectionHumanAccount, isReconnectionHumanRegeneratePrivateIdentity, isRegistration, signalCasterConfig.helpText]);


  useEffect(() => {
    const stateType = getStateType();
    const helpText = getStateHelpText();
    const state: ConnectionState = { stateType: stateType,helpText:helpText }
    onChangeState(state)
  }, [getStateType, onChangeState,getStateHelpText])

  function handleNewIdentity({ identity, address }: { identity: Identity, address: `0x${string}` }): void {
    const state: ConnectionState = { stateType: 'IDENTITY_GENERATED', identity, address }
    onChangeState(state);
    setIdentity(identity);
  }

  function reconnection() {
    const component = <WalletSwitchAccount />;
    const textArea = getStateHelpText();
    return wrapper(textArea, component);
  }

  function connect() {
    const textArea = getStateHelpText();
    const component = <WalletConnection />;
    return wrapper(textArea, component);
  }

  function changeNetwork() {
    const textArea = getStateHelpText();
    const component = <WalletSwitchChain />;
    return wrapper(textArea, component);
  }

  function verification() {
    if (!identity) {
      return;
    }
    const textArea = getStateHelpText();
    const component = <Verification identity={identity} signal={signalCasterConfig.signal} externalNullifier={signalCasterConfig.externalNullifier} verificationMessage={signalCasterConfig.castedMessage}>{children}</Verification>;
    return wrapper(textArea, component);
  }

  function registration() {
    if (!identity) {
      return;
    }
    const textArea = getStateHelpText();
    const component = <Registration identity={identity} />;
    return wrapper(textArea, component);
  }

  function identityGeneration() {
    const component = <IdentityGeneration handleNewIdentity={handleNewIdentity} />;
    const textArea = getStateHelpText();
    return wrapper(textArea, component);
  }

  function wrapper(textArea: string, component: JSX.Element) {


    return (
      <>
        <Divider pt="1" borderColor="gray.500" />
          <Tooltip label={textArea} placement='bottom-start'>
            <Box alignItems='center' >
              {component}
            </Box>
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
