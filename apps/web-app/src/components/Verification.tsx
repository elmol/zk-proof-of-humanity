import LogsContext from "@/context/LogsContext";
import { useZkProofOfHumanity, useZkProofOfHumanityRead } from "@/generated/zk-poh-contract";
import { Button, useBoolean, Text, Link, Icon } from "@chakra-ui/react";
import { Network, SemaphoreEthers, SemaphoreSubgraph } from "@semaphore-protocol/data";
import { Group } from "@semaphore-protocol/group";
import { Identity } from "@semaphore-protocol/identity";
import { generateProof } from "@semaphore-protocol/proof";
import { fetchSigner } from "@wagmi/core";
import { ethers } from "ethers";
import { BigNumber } from "ethers/lib/ethers";
import { formatBytes32String } from "ethers/lib/utils";
import { useContext, useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import { BsBoxArrowUpRight } from 'react-icons/bs';
import colors from "@/styles/colors";

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

type Props = {
  identity: Identity;
  signal:string;
  externalNullifier:string;
};

export default function Verification(props: Props) {
  const { setLogs } = useContext(LogsContext);
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
    setLogs("Prove you humanity 👆🏽");
  }, [setLogs]);
  const [transaction, setTransaction] = useState<string | undefined>()

  async function verifyHumanity() {
    if (!_identity || !groupId || !depth || !chain || !zkpoh) {
      console.error("invalid input parameters for humanity verification")
      setLogs('💻💥 Error: Some error occurred, please try again!') 
      return
    }
   
    setLoading.on();
    setLogs(`Generating humanity proof...`)
    const groupIdString = groupId.toString();
    const depthNumber = depth.toNumber();
    const network = chain.network as Network | "localhost";
    const signal32Bytes = formatBytes32String(props.signal);

    const api = network=="localhost"?new ZkPoHApi(groupIdString,depthNumber, network,semaphoreAddress):new ZkPoHApi(groupIdString,depthNumber);
    
    try{ 
      setLogs(`Verifying your humanity...`)
      const signer = await fetchSigner();
      if(!signer) {
        throw new Error("could not fetch signer")
      };

      const { proof, merkleTreeRoot, nullifierHash } = await api.generateZKPoHProof(_identity, props.externalNullifier, signal32Bytes);

      const tx = await zkpoh.connect(signer).verifyProof(BigNumber.from(merkleTreeRoot), BigNumber.from(signal32Bytes), BigNumber.from(nullifierHash), BigNumber.from(props.externalNullifier), [
        BigNumber.from(proof[0]),
        BigNumber.from(proof[1]),
        BigNumber.from(proof[2]),
        BigNumber.from(proof[3]),
        BigNumber.from(proof[4]),
        BigNumber.from(proof[5]),
        BigNumber.from(proof[6]),
        BigNumber.from(proof[7]),
      ]);
      const receipt = await tx.wait();
      console.log("tx receipt", receipt)
      setLogs('Your humanity was proved 🎉')
      const hash = receipt.transactionHash
      setTransaction(hash);
    } catch(error:any) {
      console.error(error)
      setLogs('💻💥 Error: Some error occurred, please try again!') 
    }
    setLoading.off()
  }


  return (
    <>
      <Button colorScheme="primary" onClick={verifyHumanity} isLoading={_loading} loadingText="Generating Proof">
        Verify Humanity
      </Button>
      {transaction && (<><Text align="center">
         Your humanity was proved 🎉 - {" "}
      <Link color={colors.primary[500]} href={`https://goerli.etherscan.io/tx/${transaction}`} isExternal>
         see it <Icon boxSize={3} as={BsBoxArrowUpRight} /> 
      </Link>
      </Text>
      </>)}
    </>
  );
}