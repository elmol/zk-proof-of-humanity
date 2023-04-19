import LogsContext from "@/context/LogsContext";
import { useZkProofOfHumanityRegister } from "@/generated/zk-poh-contract";
import { usePrepareRegister } from "@/hooks/usePrepareRegister";
import { Identity } from "@semaphore-protocol/identity";
import { BigNumber } from "ethers";
import { useContext, useEffect } from "react";


import theme from "../styles/index";

import { BaseButton } from "zkpoh-button";
import { ButtonActionProps, ButtonActionState } from "./ButtonAction";


export interface RegisterProps extends ButtonActionProps {
    identity:Identity
}


export function Register(props: RegisterProps) {

  const { config, error:prepareError } = usePrepareRegister({
    args: [identityCommitment()],
    enabled: props.identity != undefined,
  });

  const {write,error,isLoading} = useZkProofOfHumanityRegister({
    ...config,
    onSuccess(data) {
      props.onStateChange && props.onStateChange({ logs: `You have been registered 🎉 Signal anonymously!` });
    },
  })

  function identityCommitment(): BigNumber {
    return props.identity?.commitment ? BigNumber.from(props.identity.commitment) : BigNumber.from(0);
  }

  useEffect(() => {
    props.onStateChange && props.onStateChange({ logs: "Register to ZK Proof of Humanity 👆🏽" });
  }, [props])

  useEffect(() => {
    error && props.onStateChange && props.onStateChange({ error: error, logs: "💻💥 Error: " + error.message });
}, [error, props]);

  useEffect(() => {
    !write && prepareError && props.onStateChange && props.onStateChange({ error: prepareError, logs: "💻💥 Error: " + prepareError.message });
  }, [props,prepareError,write])


  return (
    <>
      {write && <BaseButton theme={props.theme} isLoading={isLoading} onClick={write}>Register</BaseButton>}
    </>
  );
}

export default function Registration({identity}:{identity:Identity}) {
    const { setLogs } = useContext(LogsContext);
    function handleStateChange(state: ButtonActionState) {
        setLogs(state.logs);
    }

    return (
        <>
            <Register theme={theme} onStateChange={handleStateChange} identity={identity} />
        </>
    );
}
