import { Identity } from "@semaphore-protocol/identity";
import { BigNumber } from "ethers";
import { useEffect } from "react";

import { UsePrepareContractWriteConfig, useContractWrite, useNetwork, usePrepareContractWrite } from "wagmi";
import { ButtonActionProps } from "./ButtonAction";
import BaseButton from "./BaseButton";
import { zkProofOfHumanityABI, zkProofOfHumanityAddress } from "../generated/contract";



export function usePrepareRegister(
    config: Omit<
      UsePrepareContractWriteConfig<typeof zkProofOfHumanityABI, 'register'>,
      'abi' | 'address' | 'functionName'
    > & { chainId?: keyof typeof zkProofOfHumanityAddress,
          contractAddress?:`0x${string}` | undefined } = {} as any,
  ) {

    const { chain } = useNetwork()
    const chainId = config.chainId ?? chain?.id
    const address = config.contractAddress ?? zkProofOfHumanityAddress[
        chainId as keyof typeof zkProofOfHumanityAddress
    ]
    return usePrepareContractWrite({
      abi: zkProofOfHumanityABI,
      address: address,
      functionName: 'register',
      chainId: chainId,
      ...config,
    } as UsePrepareContractWriteConfig<typeof zkProofOfHumanityABI, 'register'>)
  }


export interface RegisterProps extends ButtonActionProps {
    identity:Identity;
    contractAddress?:`0x${string}` | undefined;
}

export function Register(props: RegisterProps) {
  const { config, error: prepareError } = usePrepareRegister({
      contractAddress:props.contractAddress,
      args: [identityCommitment()],
      enabled: props.identity != undefined,
  });

  const {write,error,isLoading} = useContractWrite({
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
