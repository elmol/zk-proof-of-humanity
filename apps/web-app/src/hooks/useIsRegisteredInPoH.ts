import { useZkProofOfHumanityRead } from "@/generated/zk-poh-contract";
import { useContractRead } from "wagmi";

export function useIsRegisteredInPoH({address}:{address: `0x${string}` | undefined}) {
  const {data:pohAddress}= useZkProofOfHumanityRead({
    functionName: 'poh',
  });  
  const { data:isHuman, isError, isLoading } = useContractRead({
    address: pohAddress,
    abi: [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_submissionID",
            "type": "address"
          }
        ],
        "name": "isRegistered",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    functionName: 'isRegistered',
    args: [!address?"0x00":address], //TODO review
    enabled:pohAddress&&address?true:false
  })
  return {isHuman};
} 