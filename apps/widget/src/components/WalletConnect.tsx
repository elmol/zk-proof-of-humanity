import { Dict } from '@chakra-ui/utils';
import { ReactNode, useEffect } from "react";
import { useConnect } from "wagmi";
import { goerli, localhost } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";

import { WagmiConfig } from "wagmi";

import { QueryClient } from '@tanstack/react-query';
import { Client as Client$1, Provider, WebSocketProvider } from '@wagmi/core';
import BaseButton from './BaseButton';
export { AddChainError, Chain, ChainDoesNotSupportMulticallError, ChainMismatchError, ChainNotConfiguredError, ChainProviderFn, Connector, ConnectorAlreadyConnectedError, ConnectorData, ConnectorEvents, ConnectorNotFoundError, ContractMethodDoesNotExistError, ContractMethodNoResultError, ContractMethodRevertedError, ContractResultDecodeError, ProviderChainsNotFound, ProviderRpcError, ResourceUnavailableError, RpcError, Storage, SwitchChainError, SwitchChainNotSupportedError, Unit, UserRejectedRequestError, configureChains, createStorage, deepEqual, deserialize, erc20ABI, erc4626ABI, erc721ABI, goerli, mainnet, readContracts, sepolia, serialize } from '@wagmi/core';
export { Address } from 'abitype';


export type WalletConnectState = {
    logs: string;
    error?: Error | null
}

export type MyClient<TProvider extends Provider, TWebSocketProvider extends WebSocketProvider> = Client$1<TProvider, TWebSocketProvider> & { queryClient: QueryClient};


export interface WalletConnectProps<TProvider extends Provider, TWebSocketProvider extends WebSocketProvider>  {
    theme?: Dict | undefined;
    children: ReactNode;
    onStateChange?: (state:WalletConnectState) => void
    client:  MyClient<TProvider, TWebSocketProvider>;
}


function WalletConnect<TProvider extends Provider, TWebSocketProvider extends WebSocketProvider>(props:WalletConnectProps<TProvider, TWebSocketProvider>) {
    return (
        <>
        <WagmiConfig client={props.client}>
           <WalletConnectWrapped {...props}></WalletConnectWrapped>
        </WagmiConfig>
        </>
      );
}


function WalletConnectWrapped<TProvider extends Provider, TWebSocketProvider extends WebSocketProvider>(props:WalletConnectProps<TProvider, TWebSocketProvider>) {

    const { connect, error } = useConnect(
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
            <BaseButton theme={props.theme} onClick={() => connect() }>
                Connect Wallet!!
            </BaseButton>
        </>
    );
}

export default WalletConnect;
