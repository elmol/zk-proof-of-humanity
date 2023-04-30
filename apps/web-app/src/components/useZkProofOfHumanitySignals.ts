import { Network, SemaphoreEthers } from "@semaphore-protocol/data";
import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useContractEvent, useNetwork } from "wagmi";
import { useZkProofOfHumanityRead } from "zkpoh-widget";
import { useZkProofOfHumanityProofVerified } from "./useZkProofOfHumanityEvent";

export function useZkProofOfHumanitySignals() {
    const [signals, setSignals] = useState<any>();

    const { chain } = useNetwork();

    const { data: groupId } = useZkProofOfHumanityRead({
        functionName: "groupId",
    });
    const { data: semaphoreAddress } = useZkProofOfHumanityRead({
        functionName: "semaphore",
    });


    const fetchSignals = useCallback(() => {
        async function getSignals(network: string, semaphoreAddress: string | undefined, groupId: BigNumber) {
            let semaphoreEthers = getSemaphoreEthers(network, semaphoreAddress);
            return await semaphoreEthers.getGroupVerifiedProofs(groupId.toString());
        }

        function getSemaphoreEthers(network: string, semaphoreAddress: string | undefined) {
            if ("localhost" == network) {
                return new SemaphoreEthers("http://localhost:8545", {
                    address: semaphoreAddress,
                });
            }
            return new SemaphoreEthers(network);
        }

        async function fetchData() {
            if (!chain)
                return;
            if (!semaphoreAddress)
                return;
            if (!groupId)
                return;
            const network = chain.network as Network | "localhost";
            if (network != "localhost")
                return;
            const signals = await getSignals(network, semaphoreAddress, groupId);
            setSignals(signals);
        }
        fetchData();
    }, [chain, groupId, semaphoreAddress]);

    useZkProofOfHumanityProofVerified({
        listener() {
          fetchSignals();
        },
    });

    useEffect(() => {
        fetchSignals();
    }, [fetchSignals]);

    return signals;

}
