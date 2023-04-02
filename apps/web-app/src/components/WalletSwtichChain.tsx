import LogsContext from "@/context/LogsContext";
import { Button } from "@chakra-ui/react";
import { Identity } from "@semaphore-protocol/identity";
import { verifyMessage } from "ethers/lib/utils";
import { useContext, useEffect } from "react";
import { useConnect, useNetwork, useSignMessage, useSwitchNetwork } from "wagmi";
import { goerli, localhost } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";

export function WalletSwitchChain() {
  const { setLogs } = useContext(LogsContext);

  const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork()

  useEffect(() => {
    setLogs("Switch network to continue 👆🏽")
  }, [setLogs])

  useEffect(() => {
    error && setLogs('💻💥 Error: ' +  error.message )
 }, [setLogs,error])

  return (
    <>
      <Button colorScheme="primary" isLoading={isLoading} onClick={() => switchNetwork?.(chains[0].id)} loadingText="Check wallet">
        Switch Network
      </Button>
    </>
  );
}
