import { useBoolean } from "@chakra-ui/react";
import { useEffect } from "react";

import { ButtonActionProps } from "./ButtonAction";
import BaseButton from "./BaseButton";

export default function WalletAccountSwitcher(props: ButtonActionProps) {
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
