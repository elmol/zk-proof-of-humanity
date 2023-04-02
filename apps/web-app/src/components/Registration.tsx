import LogsContext from "@/context/LogsContext";
import { useZkProofOfHumanityRegister } from "@/generated/zk-poh-contract";
import { usePrepareRegister } from "@/hooks/usePrepareRegister";
import { Button } from "@chakra-ui/react";
import { Identity } from "@semaphore-protocol/identity";
import { BigNumber } from "ethers";
import { useContext, useEffect } from "react";



export default function Registration({identity}:{identity:Identity}) {

  const { setLogs } = useContext(LogsContext)
  
  const { config, error:prepareError } = usePrepareRegister({
    args: [identityCommitment()],
    enabled:identity != undefined,
  });

  const {write,error,isLoading} = useZkProofOfHumanityRegister({
    ...config,
    onSuccess(data) {
      setLogs(`You have been registered 🎉 Signal anonymously!`)
    },
  })

  function identityCommitment(): BigNumber {
    return identity?.commitment ? BigNumber.from(identity.commitment) : BigNumber.from(0);
  }

  useEffect(() => {
    setLogs("Register to ZK Proof of Humanity 👆🏽")
  }, [setLogs])
  
  useEffect(() => {
     error && setLogs('💻💥 Error: ' +  error.message )
  }, [setLogs,error])
 
  useEffect(() => {
    !write && prepareError && setLogs('💻💥 Error: ' +  prepareError.message ) 
  }, [setLogs,prepareError,write])


  return (
    <>
      {write && <Button colorScheme="primary" isLoading={isLoading} onClick={write} loadingText='Check wallet' >Register</Button>}
    </>
  );
}