import LogsContext from "@/context/LogsContext";
import { Identity } from "@semaphore-protocol/identity";
import { useContext } from "react";

import theme from "../styles/index";

import { IdentityGenerator } from "@/widget/IdentityGenerator";
import { ButtonActionState } from "../widget/ButtonAction";

interface Props {
    handleNewIdentity: (credential: { identity: Identity; address: `0x${string}` }) => void;
}

export function IdentityGeneration(props: Props) {
    const { setLogs } = useContext(LogsContext);
    function handleStateChange(state: ButtonActionState) {
        setLogs(state.logs);
    }

    return (
        <>
            <IdentityGenerator theme={theme} onStateChange={handleStateChange} {...props} />
        </>
    );
}
