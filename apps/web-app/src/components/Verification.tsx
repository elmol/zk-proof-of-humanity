import LogsContext from "@/context/LogsContext";
import { Identity } from "@semaphore-protocol/identity";
import { BigNumber } from "ethers/lib/ethers";
import { ReactNode, useContext } from "react";




import { ButtonActionState } from "@/widget/ButtonAction";
import Prover from "@/widget/Prover";
import theme from "../styles/index";

interface Props {
    identity: Identity;
    signal:string;
    externalNullifier:BigNumber | undefined;
    verificationMessage:string;
    children: ReactNode;
};


export default function Verification(props:Props) {
    const { setLogs } = useContext(LogsContext);
    function handleStateChange(state: ButtonActionState) {
        setLogs(state.logs);
    }

    return (
        <>
            <Prover theme={theme} onStateChange={handleStateChange} {...props} />
        </>
    );
}
