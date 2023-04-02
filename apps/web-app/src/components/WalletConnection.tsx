import LogsContext from "@/context/LogsContext";
import colors from "@/styles/colors";
import { Button, Icon, Link, Text } from "@chakra-ui/react";
import { Identity } from "@semaphore-protocol/identity";
import { verifyMessage } from "ethers/lib/utils";
import { useContext, useEffect } from "react";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { useConnect, useSignMessage } from "wagmi";
import { goerli, localhost } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";

export function WalletConnection() {
  const { setLogs } = useContext(LogsContext);

  const { connect, error } = useConnect(
    {
    chainId: goerli.id,
    connector: new InjectedConnector({
      chains: [goerli, localhost],
    }),
  });
  
  useEffect(() => {
    setLogs("Connect Wallet to start 👆🏽")
  }, [setLogs])

  useEffect(() => {
    error && setLogs('💻💥 Error: ' +  error.message )
 }, [setLogs,error])

  return (
    <>
      <Button colorScheme="primary" onClick={() => connect()}>
        Connect Wallet
      </Button>
    </>
  );
}
