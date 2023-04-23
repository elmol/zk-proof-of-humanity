import { useEffect } from "react";
import { useSwitchNetwork } from "wagmi";

import { ButtonActionProps } from "./ButtonAction";
import BaseButton from "./BaseButton";

export default function WalletChainSwitcher(props: ButtonActionProps) {
    const { chains, error, isLoading, switchNetwork } = useSwitchNetwork();

    useEffect(() => {
        props.onStateChange && props.onStateChange({ logs: "Switch network to continue 👆🏽" });
    }, [props]);

    useEffect(() => {
        error && props.onStateChange && props.onStateChange({ error: error, logs: "💻💥 Error: " + error.message });
    }, [error, props]);

    console.log("*** Rendering Wallet Chain Switcher");
    return (
        <>
            <BaseButton theme={props.theme} isLoading={isLoading} onClick={() => switchNetwork?.(chains[0].id)}>
                {props.children ? props.children : "Switch Network"}
            </BaseButton>
        </>
    );
}
