import LogsContext from "@/context/LogsContext";
import { useContext } from "react";
import { WalletConnect, WalletConnectState } from "zkpoh-button";
import theme from "../styles/index";

import { useClient } from "wagmi";

export function WalletConnection() {

  const client=useClient();
  const { setLogs } = useContext(LogsContext);

  function handleStateChange(state:WalletConnectState) {
    setLogs(state.logs);
  }

  return (
    <>
      <WalletConnect theme={theme} onStateChange={handleStateChange} client={client} >
        Connect Wallet
      </WalletConnect>
    </>
  );
}
