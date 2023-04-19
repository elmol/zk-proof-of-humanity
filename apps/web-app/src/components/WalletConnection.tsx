import LogsContext from "@/context/LogsContext";
import { useContext } from "react";
import theme from "../styles/index";

import { WalletConnect, WalletConnectState } from "zkpoh-button";

export function WalletConnection() {

  const { setLogs } = useContext(LogsContext);
  function handleStateChange(state:WalletConnectState) {
    setLogs(state.logs);
  }

  return (
    <>
      <WalletConnect theme={theme} onStateChange={handleStateChange}/>
    </>
  );
}
