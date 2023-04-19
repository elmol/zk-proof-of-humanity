import LogsContext from "@/context/LogsContext";
import { Identity } from "@semaphore-protocol/identity";
import { verifyMessage } from "ethers/lib/utils";
import { useContext, useEffect } from "react";
import { useSignMessage } from "wagmi";


import theme from "../styles/index";

import { BaseButton } from "zkpoh-button";
import { ButtonActionProps, ButtonActionState } from "./ButtonAction";

const message = "zk-proof-of-humanity";

export interface NewIdentityProps extends ButtonActionProps {
    handleNewIdentity: (credential: { identity: Identity; address: `0x${string}` }) => void;
}

export function IdentityGenerator(props: NewIdentityProps) {
    const { data, error, isLoading, signMessage } = useSignMessage({
        message,
        onSuccess(data, variables) {
            const identity = new Identity(data);
            const address = verifyMessage(variables.message, data);
            props.handleNewIdentity({ identity: identity, address: address as `0x${string}` });
            props.onStateChange && props.onStateChange({ logs: "Your new Semaphore identity was just created 🎉" });
        },
    });

    useEffect(() => {
        props.onStateChange && props.onStateChange({ logs: "Generate your Semaphore identity 👆🏽" });
    }, [props]);

    useEffect(() => {
        error && props.onStateChange && props.onStateChange({ error: error, logs: "💻💥 Error: " + error.message });
    }, [error, props]);

    console.log("*** Rendering Identity Generation");

    return (
        <>
            <BaseButton theme={props.theme} isLoading={isLoading} onClick={() => signMessage()}>
                {props.children ? props.children : isLoading ? "Check Wallet" : "Generate Identity"}
            </BaseButton>
        </>
    );
}

export function IdentityGeneration({
    handleNewIdentity,
}: {
    handleNewIdentity: (credential: { identity: Identity; address: `0x${string}` }) => void;
}) {
    const { setLogs } = useContext(LogsContext);
    function handleStateChange(state: ButtonActionState) {
        setLogs(state.logs);
    }

    return (
        <>
            <IdentityGenerator theme={theme} onStateChange={handleStateChange} handleNewIdentity={handleNewIdentity} />
        </>
    );
}
