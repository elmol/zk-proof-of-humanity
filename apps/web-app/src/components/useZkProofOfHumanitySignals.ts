import { Network, SemaphoreEthers } from "@semaphore-protocol/data";
import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import { useZkProofOfHumanityRead } from "zkpoh-widget";
import { useZkProofOfHumanityProofVerified } from "./useZkProofOfHumanityEvent";

export interface SignalsProps {
    contractAddress?: `0x${string}` | undefined;
}

export function useZkProofOfHumanitySignals(props: SignalsProps={}) {
    const [signals, setSignals] = useState<any>();

    const { chain } = useNetwork();

    const { data: groupId } = useZkProofOfHumanityRead({
        contractAddress: props.contractAddress,
        functionName: "groupId",
    });
    const { data: semaphoreAddress } = useZkProofOfHumanityRead({
        contractAddress: props.contractAddress,
        functionName: "semaphore",
    });

    const fetchSignals = useCallback(() => {
        async function getSignals(network: string, semaphoreAddress: string, groupId: BigNumber) {
            let semaphoreEthers = getSemaphoreEthers(network, semaphoreAddress);
            return await semaphoreEthers.getGroupVerifiedProofs(groupId.toString());
        }

        function getSemaphoreEthers(network: string, semaphoreAddress: string) {
            const semaphore = "localhost" == network ? "http://localhost:8545" : network;
            return new SemaphoreEthers(semaphore, {
                address: semaphoreAddress,
            });
        }

        async function fetchData() {
            if (!chain) return;
            if (!semaphoreAddress) return;
            if (!groupId) return;
            const network = chain.network as Network | "localhost";
            const signals = await getSignals(network, semaphoreAddress, groupId);
            setSignals(signals);
        }
        fetchData();
    }, [chain, groupId, semaphoreAddress]);

    useZkProofOfHumanityProofVerified({
        contractAddress: props.contractAddress,
        listener() {
            fetchSignals();
        },
    });

    useEffect(() => {
        fetchSignals();
    }, [fetchSignals]);

    return signals;
}
