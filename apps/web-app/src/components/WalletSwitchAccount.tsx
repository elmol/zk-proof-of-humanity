import LogsContext from "@/context/LogsContext";
import { useBoolean } from "@chakra-ui/react";
import { useContext, useEffect } from "react";

import theme from "../styles/index";

import { BaseButton } from "zkpoh-button";
import { ButtonActionProps, ButtonActionState } from "../widget/ButtonAction";

export function WalletAccountSwitcher(props: ButtonActionProps) {
    const [_loading, setLoading] = useBoolean();

    useEffect(() => {
        props.onStateChange && props.onStateChange({ logs: "Switch connection account 👆🏽" });
    }, [props]);

    async function switchAccount() {
        if (window.ethereum) {
            setLoading.on();
            try {
                await window.ethereum.request({ method: "wallet_requestPermissions", params: [{ eth_accounts: {} }] });
            } catch (error: any) {
                console.error(error);
                props.onStateChange && props.onStateChange({ error: error, logs: "💻💥 Error: " + error.message });
            }
            setLoading.off();
        } else {
            const message = "Please install Metamask";
            const error: Error = {
                name: "Missing Metamask",
                message,
            };
            console.error(message);
            props.onStateChange && props.onStateChange({ error: error, logs: "💻💥 Error: " + error.message });
        }
    }
    console.log("*** Rendering Wallet Account Switcher");
    return (
        <>
            <BaseButton theme={props.theme} isLoading={_loading} onClick={switchAccount}>
                {props.children ? props.children : "ReConnect"}
            </BaseButton>
        </>
    );
}

export function WalletSwitchAccount() {
    const { setLogs } = useContext(LogsContext);
    function handleStateChange(state: ButtonActionState) {
        setLogs(state.logs);
    }

    return (
        <>
            <WalletAccountSwitcher theme={theme} onStateChange={handleStateChange} />
        </>
    );
}
