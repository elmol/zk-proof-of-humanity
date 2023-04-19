import LogsContext from "@/context/LogsContext";
import { useContext, useEffect } from "react";
import { useSwitchNetwork } from "wagmi";
import theme from "../styles/index";

import { Dict } from "@chakra-ui/utils";
import { ReactNode } from "react";
import { BaseButton } from "zkpoh-button";

export type WalletChainSwitcherState = {
    logs: string;
    error?: Error | null;
};

export interface WalletChainSwitcherProps {
    theme?: Dict | undefined;
    children?: ReactNode;
    onStateChange?: (state: WalletChainSwitcherState) => void;
}

function WalletChainSwitcher(props: WalletChainSwitcherProps) {
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
    function handleStateChange(state: WalletChainSwitcherState) {
        setLogs(state.logs);
    }

    return (
        <>
            <WalletChainSwitcher theme={theme} onStateChange={handleStateChange} />
        </>
    );
}
