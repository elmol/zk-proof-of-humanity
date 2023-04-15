import LogsContext from "@/context/LogsContext";
import { Dict } from '@chakra-ui/utils';
import { BaseButton } from "@zkpoh/button";
import { ReactNode, useContext, useEffect } from "react";
import { useConnect } from "wagmi";
import { goerli, localhost } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import theme from "../styles/index";

export type WalletConnectState = {
    logs: string;
    error?: Error | null
}


export interface WalletConnectProps  {
    theme?: Dict | undefined;
    children: ReactNode;
    onStateChange?: (state:WalletConnectState) => void
}

function WalletConnect(props:WalletConnectProps) {

    const { connect, error } = useConnect(
      {
      chainId: goerli.id,
      connector: new InjectedConnector({
        chains: [goerli, localhost],
      }),
    });

    useEffect(() => {
        props.onStateChange && props.onStateChange({ logs: "Connect Wallet to start 👆🏽" });
    }, [props]);

    useEffect(() => {
        error && props.onStateChange && props.onStateChange({ error: error, logs: "💻💥 Error: " + error.message });
    }, [error, props]);

    console.log("*** Rendering Wallet Connect")
    return (
      <>
        <BaseButton theme={theme} onClick={() => connect()}>
          Connect Wallet
        </BaseButton>
      </>
    );
}


export function WalletConnection() {
  const { setLogs } = useContext(LogsContext);


  function handleStateChange(state:WalletConnectState) {
    setLogs(state.logs);
  }

  return (
    <>
      <WalletConnect theme={theme} onStateChange={handleStateChange} >
        Connect Wallet
      </WalletConnect>
    </>
  );
}
