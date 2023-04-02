import LogsContext from "@/context/LogsContext";
import { Button, useBoolean } from "@chakra-ui/react";
import { Identity } from "@semaphore-protocol/identity";
import { verifyMessage } from "ethers/lib/utils";
import { useContext, useEffect } from "react";
import { useConnect, useSignMessage } from "wagmi";
import { goerli, localhost } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";

export function WalletSwitchAccount() {
  const { setLogs } = useContext(LogsContext);
  const [_loading, setLoading] = useBoolean();
  useEffect(() => {
    setLogs("Switch connection account 👆🏽");
  }, [setLogs]);

  async function switchAccount() {
    if (window.ethereum) {
      setLoading.on();
      try {
        await window.ethereum.request({ method: "wallet_requestPermissions", params: [{ eth_accounts: {} }] });
      } catch (error: any) {
        console.error(error);
        setLogs("💻💥 Error: " + error.message);
      }
      setLoading.off();
    } else {
      const message = "Please install Metamask";
      console.error(message);
      setLogs("💻💥 Error: " + message);
    }
  }

  return (
    <>
      <Button colorScheme="primary" isLoading={_loading} onClick={switchAccount} loadingText="Check wallet">
        ReConnect
      </Button>
    </>
  );
}
