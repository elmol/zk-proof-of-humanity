import { useEffect } from "react";
import { useConnect } from "wagmi";
import { sepolia,goerli, localhost } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import { ButtonActionProps } from "./ButtonAction";
import BaseButton from "./BaseButton";

function WalletConnect(props: ButtonActionProps) {
    const { connect, error, isLoading } = useConnect({
        chainId: goerli.id,
        connector: new InjectedConnector({
            chains: [sepolia, goerli, localhost],
        }),
    });

    useEffect(() => {
        props.onStateChange && props.onStateChange({ logs: "Connect Wallet to start 👆🏽" });
    }, [props]);

    useEffect(() => {
        error && props.onStateChange && props.onStateChange({ error: error, logs: "💻💥 Error: " + error.message });
    }, [error, props]);

    console.log("*** Rendering Wallet Connect");
    return (
        <>
            <BaseButton theme={props.theme} isLoading={isLoading} onClick={() => connect()}>
                {props.children ? props.children : "Connect Wallet"}
            </BaseButton>
        </>
    );
}

export default WalletConnect;
