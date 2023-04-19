import { Dict } from '@chakra-ui/utils';
import { ReactNode, useEffect } from "react";
import { useConnect } from "wagmi";
import { goerli, localhost } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import BaseButton from './BaseButton';

export type WalletConnectState = {
    logs: string;
    error?: Error | null
}

export interface WalletConnectProps {
    theme?: Dict | undefined;
    children: ReactNode;
    onStateChange?: (state:WalletConnectState) => void
}


function WalletConnect(props:WalletConnectProps) {

    const { connect, error, isLoading } = useConnect(
      {
      chainId: goerli.id,
      connector: new InjectedConnector({
        chains: [goerli, localhost],
      })
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
            <BaseButton theme={props.theme} isLoading={isLoading} onClick={() => connect()}>
                Connect Wallet
            </BaseButton>
        </>
    );
}

export default WalletConnect;
