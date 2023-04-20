import LogsContext from "@/context/LogsContext";
import { Identity } from "@semaphore-protocol/identity";
import { useContext } from "react";

import theme from "../styles/index";

import { Register } from "@/widget/Register";
import { ButtonActionState } from "../widget/ButtonAction";

interface Props {
    identity: Identity;
}

export default function Registration(props: Props) {
    const { setLogs } = useContext(LogsContext);
    function handleStateChange(state: ButtonActionState) {
        setLogs(state.logs);
    }

    return (
        <>
            <Register theme={theme} onStateChange={handleStateChange} {...props} />
        </>
    );
}
