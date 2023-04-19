import LogsContext from "@/context/LogsContext";
import { useContext, useEffect } from "react";
import { useSwitchNetwork } from "wagmi";
import theme from "../styles/index";

import { BaseButton } from "zkpoh-button";
import { ButtonActionProps, ButtonActionState } from "./ButtonAction";

function WalletChainSwitcher(props: ButtonActionProps) {
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

export function WalletSwitchChain() {
    const { setLogs } = useContext(LogsContext);
    function handleStateChange(state: ButtonActionState) {
        setLogs(state.logs);
    }

    return (
        <>
            <WalletChainSwitcher theme={theme} onStateChange={handleStateChange} />
        </>
    );
}
