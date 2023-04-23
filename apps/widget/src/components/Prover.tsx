import { Network, SemaphoreEthers, SemaphoreSubgraph } from "@semaphore-protocol/data";
import { Group } from "@semaphore-protocol/group";
import { Identity } from "@semaphore-protocol/identity";
import { generateProof } from "@semaphore-protocol/proof";

import { BigNumber } from "ethers/lib/ethers";
import { formatBytes32String } from "ethers/lib/utils";

import { useEffect, useState } from "react";
import { BsBoxArrowUpRight } from "react-icons/bs";

import { UseContractConfig, UseContractReadConfig, useContract, useContractRead, useNetwork } from "wagmi";
import { fetchSigner } from "@wagmi/core";
import { ReadContractResult } from "wagmi/actions";

import { Button, ChakraProvider, Icon, Link, Text, useBoolean } from "@chakra-ui/react";
import { zkProofOfHumanityABI, zkProofOfHumanityAddress } from "../generated/contract";
import { ButtonActionProps } from "./ButtonAction";

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zkProofOfHumanityABI}__.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x611F0278dE9D2Bd4E38F15001B6410B4A915275f)
 * -
 * -
 */
export function useZkProofOfHumanityRead<
    TFunctionName extends string,
    TSelectData = ReadContractResult<typeof zkProofOfHumanityABI, TFunctionName>
>(
    config: Omit<UseContractReadConfig<typeof zkProofOfHumanityABI, TFunctionName, TSelectData>, "abi" | "address"> & {
        chainId?: keyof typeof zkProofOfHumanityAddress;
    } = {} as any
) {
    const { chain } = useNetwork();
    const chainId = config.chainId ?? chain?.id;
    return useContractRead({
        abi: zkProofOfHumanityABI,
        address: zkProofOfHumanityAddress[chainId as keyof typeof zkProofOfHumanityAddress],
        ...config,
    } as UseContractReadConfig<typeof zkProofOfHumanityABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContract}__ with `abi` set to __{@link zkProofOfHumanityABI}__.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x611F0278dE9D2Bd4E38F15001B6410B4A915275f)
 * -
 * -
 */
export function useZkProofOfHumanity(
    config: Omit<UseContractConfig, "abi" | "address"> & {
        chainId?: keyof typeof zkProofOfHumanityAddress;
    } = {} as any
) {
    const { chain } = useNetwork();
    const chainId = config.chainId ?? chain?.id;
    return useContract({
        abi: zkProofOfHumanityABI,
        address: zkProofOfHumanityAddress[chainId as keyof typeof zkProofOfHumanityAddress],
        ...config,
    });
}

export class ZkPoHApi {
    constructor(
        public readonly groupId: string,
        public readonly depth: number = 20,
        public readonly network: Network | "localhost" = "goerli",
        public readonly semaphoreAddress: string | undefined = undefined
    ) {}
    async generateZKPoHProof(identity: Identity, externalNullifier: string, signal: string) {
        const members = await this.getGroupMembers();
        const group = new Group(this.groupId, this.depth);
        members && group.addMembers(members);
        return await generateProof(identity, group, externalNullifier, signal);
    }

    private async getGroupMembers() {
        if ("localhost" == this.network) {
            const semaphoreEthers = new SemaphoreEthers("http://localhost:8545", {
                address: this.semaphoreAddress,
            });
            return await semaphoreEthers.getGroupMembers(this.groupId);
        }
        const subgraph = new SemaphoreSubgraph(this.network);
        const { members } = await subgraph.getGroup(this.groupId, { members: true });
        return members;
    }
}

interface Props {
    identity: Identity;
    signal: string;
    externalNullifier: BigNumber | undefined;
    verificationMessage: string;
}

export interface ProverProps extends ButtonActionProps, Props {}

export function Prover(props: ProverProps) {
    const _identity = props.identity;
    const [_loading, setLoading] = useBoolean();

    const zkpoh = useZkProofOfHumanity();
    const { chain } = useNetwork();
    // should be moved to register component
    const { data: groupId } = useZkProofOfHumanityRead({
        functionName: "groupId",
    });

    // should be moved to register component
    const { data: depth } = useZkProofOfHumanityRead({
        functionName: "depth",
    });

    // should be moved to register component
    const { data: semaphoreAddress } = useZkProofOfHumanityRead({
        functionName: "semaphore",
    });

    useEffect(() => {
        props.onStateChange && props.onStateChange({ logs: "Prove you humanity 👆🏽" });
    }, [props]);

    const [transaction, setTransaction] = useState<string | undefined>();

    async function verifyHumanity() {
        if (!_identity || !groupId || !depth || !chain || !zkpoh) {
            console.error("invalid input parameters for humanity verification");
            const error: Error = {
                message: "💻💥 Error: Some error occurred, please try again!",
                name: "Invalid Input Parameters",
            };
            props.onStateChange && props.onStateChange({ error: error, logs: "💻💥 Error: " + error.message });
            return;
        }

        setLoading.on();
        props.onStateChange && props.onStateChange({ logs: `Generating humanity proof...` });
        const groupIdString = groupId.toString();
        const depthNumber = depth.toNumber();
        const network = chain.network as Network | "localhost";
        const signal32Bytes = formatBytes32String(props.signal);

        const api =
            network == "localhost"
                ? new ZkPoHApi(groupIdString, depthNumber, network, semaphoreAddress)
                : new ZkPoHApi(groupIdString, depthNumber);

        try {
            props.onStateChange && props.onStateChange({ logs: `Verifying your humanity...` });
            const signer = await fetchSigner();
            if (!signer) {
                throw new Error("could not fetch signer");
            }
            if (!props.externalNullifier) {
                throw new Error("externalNullifier not null");
            }

            const { proof, merkleTreeRoot, nullifierHash } = await api.generateZKPoHProof(
                _identity,
                props.externalNullifier.toString(),
                signal32Bytes
            );

            const tx = await zkpoh
                .connect(signer)
                .verifyProof(
                    BigNumber.from(merkleTreeRoot),
                    BigNumber.from(signal32Bytes),
                    BigNumber.from(nullifierHash),
                    BigNumber.from(props.externalNullifier),
                    [
                        BigNumber.from(proof[0]),
                        BigNumber.from(proof[1]),
                        BigNumber.from(proof[2]),
                        BigNumber.from(proof[3]),
                        BigNumber.from(proof[4]),
                        BigNumber.from(proof[5]),
                        BigNumber.from(proof[6]),
                        BigNumber.from(proof[7]),
                    ]
                );
            const receipt = await tx.wait();
            console.log("tx receipt", receipt);
            props.onStateChange && props.onStateChange({ logs: "Your humanity was proved 🎉" });
            const hash = receipt.transactionHash;
            setTransaction(hash);
        } catch (error: any) {
            console.error(error);
            props.onStateChange && props.onStateChange({ error: error, logs: "💻💥 Error: " + error.message });
        }
        setLoading.off();
    }

    return (
        <>
            <ChakraProvider theme={props.theme}>
                <Button
                    colorScheme="primary"
                    width="100%"
                    onClick={verifyHumanity}
                    isLoading={_loading}
                    loadingText="Generating Proof"
                >
                    {props.children}
                </Button>
                {transaction && (
                    <>
                        <Text align="center">
                            {props.verificationMessage} -{" "}
                            <Link color="teal.500" href={`https://goerli.etherscan.io/tx/${transaction}`} isExternal>
                                see it <Icon boxSize={3} as={BsBoxArrowUpRight} />
                            </Link>
                        </Text>
                    </>
                )}
            </ChakraProvider>
        </>
    );
}
