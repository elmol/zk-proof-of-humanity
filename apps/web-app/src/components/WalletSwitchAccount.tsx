import LogsContext from "@/context/LogsContext";
import { useContext } from "react";

import theme from "../styles/index";

import WalletAccountSwitcher from "@/widget/WalletAccountSwitcher";
import { ButtonActionState } from "@/widget/ButtonAction";


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
