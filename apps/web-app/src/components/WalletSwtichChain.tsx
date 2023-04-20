import LogsContext from "@/context/LogsContext";
import { useContext } from "react";
import theme from "../styles/index";

import WalletChainSwitcher from "@/widget/WalletChainSwitcher";
import { ButtonActionState } from "../widget/ButtonAction";



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
