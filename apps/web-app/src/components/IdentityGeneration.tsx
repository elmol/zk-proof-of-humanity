import LogsContext from "@/context/LogsContext";
import { Button } from "@chakra-ui/react";
import { Identity } from "@semaphore-protocol/identity";
import { verifyMessage } from "ethers/lib/utils";
import { useContext, useEffect } from "react";
import { useSignMessage } from "wagmi";

const message = "zk-proof-of-humanity";

type Props = {
  handleNewIdentity: (credential:{ identity: Identity, address: `0x${string}`}) => void
};


export function IdentityGeneration(props:Props) {    

  const { setLogs } = useContext(LogsContext)

  const { data, error, isLoading, signMessage } = useSignMessage({
    message,
    onSuccess(data, variables) {
      const identity = new Identity(data);
      const address = verifyMessage(variables.message, data);
      props.handleNewIdentity({identity:identity, address:address as`0x${string}`});
      setLogs("Your new Semaphore identity was just created 🎉")
    },
  });

  useEffect(() => {
    setLogs("Generate your Semaphore identity 👆🏽")
  }, [setLogs])
  
  useEffect(() => {
     error && setLogs('💻💥 Error: ' +  error.message )
  }, [setLogs,error])
 
  return (
    <>
      <Button colorScheme="primary" isLoading={isLoading} loadingText='Check wallet' onClick={() => signMessage()}>
          {isLoading ? "Check Wallet" : "Generate Identity"}
      </Button>
    </>
  );
}
