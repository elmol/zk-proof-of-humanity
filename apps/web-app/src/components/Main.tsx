import LogsContext from "@/context/LogsContext";
import { useZkVotingRead } from "@/generated/zk-voting";
import colors from "@/styles/colors";
import {
    Box,
    Button,
    Container,
    Flex,
    HStack,
    Icon,
    IconButton,
    Image,
    Link,
    Radio,
    RadioGroup,
    SimpleGrid,
    Spacer,
    Stack,
    Text,
    useBreakpointValue,
} from "@chakra-ui/react";
import { Identity } from "@semaphore-protocol/identity";
import { BigNumber } from "ethers/lib/ethers";
import { formatBytes32String } from "ethers/lib/utils.js";
import parse from "html-react-parser";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import NoSSR from "react-no-ssr";
import { useAccount, useDisconnect, useNetwork } from "wagmi";
import {
    ButtonActionState,
    ConnectionState,
    ConnectionStateType,
    ZKPoHConnect,
    useIsRegisteredInPoH,
    useZkProofOfHumanity,
    useZkProofOfHumanitySignals,
} from "zkpoh-widget";
import theme from "../styles/index";
import Card from "./Card";
import ListItem from "./ListItem";

export default function Main() {
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const { chain } = useNetwork();

    const zkPoHConfig = {
        confirmationMessage: "The vote was cast successfully 🗳️",
        helpText:
            "Your identity is registered in ZK Proof of Humanity and generated, so now you can now vote on the proposal.",
    };

    const { setLogs } = useContext(LogsContext);
    function handleLog(state: ButtonActionState) {
        setLogs(state.logs);
    }
    const [connectionStateType, setConnectionStateType] = useState<ConnectionStateType>();
    const [helpText, setHelpText] = useState<string>();
    function handleChangeState(state: ConnectionState) {
        setConnectionStateType(state.stateType);
        setHelpText(state.helpText);
        if (state.stateType == "IDENTITY_GENERATED") {
            setIdentity(state.identity);
            setAddressIdentity(state.address);
        }
    }

    const contract = useZkProofOfHumanity();
    const { isHuman } = useIsRegisteredInPoH({ address });

    const [pollId, setPollId] = useState<BigNumber | undefined>();

    const router = useRouter();
    useEffect(() => {
        const pollId = router.query.pollId;
        if (!pollId) {
            console.error("*** Invalid pollId");
            return;
        }
        const pollIdBig = BigNumber.from(pollId);
        console.log("*** Specific PollId: ", pollId);
        setPollId(pollIdBig);
    }, [router.query.pollId]);

    const { data: pollIds } = useZkVotingRead({
        functionName: "getPollIds",
    });
    useEffect(() => {
        setPollId(pollIds ? pollIds[0] : undefined);
    }, [pollIds]);

    const { data: proposal } = useZkVotingRead({
        functionName: "polls",
        args: [pollId ? pollId : BigNumber.from("0")],
    });

    const valueSignalYes = "YES";
    const valueSignalNo = "NO";

    const [_identity, setIdentity] = useState<Identity>();
    const [_addressIdentity, setAddressIdentity] = useState<`0x${string}` | undefined>();

    const [votesPercentageYes, setVotesPercentageYes] = useState(0);
    const [votesPercentageNo, setVotesPercentageNo] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const [selectedVote, setSelectedVote] = useState<string>(valueSignalYes);

    function shortenAddress(address: string | undefined | any) {
        if (!address) return "";
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    const votes = useZkProofOfHumanitySignals({ externalNullifier: pollId });

    const count = useCallback(
        (voteType: string) => {
            const ballot32Type = formatBytes32String(voteType);
            return votes?.reduce(
                (n: number, vote: any) =>
                    BigNumber.from(vote.signal).eq(BigNumber.from(ballot32Type)) ? n + 1 : n,
                0
            );
        },
        [votes]
    );

    useEffect(() => {
        if (!votes) return;

        const resultYes = count(valueSignalYes);
        const resultNo = count(valueSignalNo);
        setTotalCount(votes.length);

        const _c1Percentage = (resultYes * 100) / votes.length;
        const _c2Percentage = (resultNo * 100) / votes.length;
        setVotesPercentageYes(isNaN(_c1Percentage) ? 0 : _c1Percentage);
        setVotesPercentageNo(isNaN(_c2Percentage) ? 0 : _c2Percentage);
    }, [count, pollId, votes]);

    function viewAllPanels(){
        if(isConnected && chain && !chain.unsupported) return true;
        return false;
    }

    return (
        <>
            <NoSSR>
                <Card bg={"secondaryGray.900"} flexDirection="column" w="99%" p="5px" px="5px" mt="5px" mx="auto">
                    <HStack align="center" justify="right" px={{ base: 4 }}>
                        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
                            <Image w="40px" h="40px" src="./icon_zk_vote.png" alt="Zk Vote" marginRight="5px" />
                            <Text
                                marginTop="2"
                                textAlign={useBreakpointValue({ base: "center", md: "left" })}
                                fontFamily={"heading"}
                                color="secondaryGray.100"
                                fontSize="xl"
                                fontWeight="700"
                            >
                                <b>ZK POH Vote </b>
                                <Link href="https://github.com/elmol/zk-proof-of-humanity-vote" isExternal>
                                    <IconButton
                                        backgroundColor={"secondaryGray.900"}
                                        aria-label="Github repository"
                                        icon={<Icon boxSize={4} as={FaGithub} />}
                                    />
                                </Link>
                            </Text>
                        </Flex>
                        <Spacer></Spacer>
                        {_identity && _addressIdentity && (
                            <>
                                <Text color="secondaryGray.100" fontSize="md" fontWeight="900">
                                    | <b>🔒 Identity:</b>
                                </Text>
                                <Text color="secondaryGray.100" fontSize="md" fontWeight="800">
                                    {" "}
                                    - <b>Human Address:</b>{" "}
                                </Text>{" "}
                                <EtherScanLink address={_addressIdentity} network={chain?.network}>
                                    <Text>{shortenAddress(_addressIdentity)} </Text>
                                </EtherScanLink>
                                <Text color="secondaryGray.100" fontSize="md" fontWeight="800">
                                    {" "}
                                    - <b>Identity Commitment:</b>{" "}
                                </Text>
                                <Text fontSize="md" color="primary.400">
                                    {" "}
                                    {shortenAddress(_identity?.commitment.toString())}{" "}
                                </Text>
                            </>
                        )}
                        {isConnected && contract && (
                            <Text color="secondaryGray.100" fontWeight="800">
                                {" "}
                                | <b>Contract:</b>{" "}
                                <EtherScanLink address={contract.address} network={chain?.network}>
                                    {shortenAddress(contract.address)}
                                </EtherScanLink>
                            </Text>
                        )}
                        {chain && (
                            <Text color="secondaryGray.100" fontWeight="800">
                                {" "}
                                | <b>Network:</b> {chain.unsupported ? "Wrong Network" : chain.name}
                            </Text>
                        )}
                        {isConnected && address && (
                            <>
                                <Text color="secondaryGray.100" fontWeight="800">
                                    {" "}
                                    | <b>Connected to </b>{" "}
                                    <EtherScanLink address={address} network={chain?.network}>
                                        {shortenAddress(address)}
                                    </EtherScanLink>{" "}
                                    {isHuman ? "🧑" : "🤖"} |{" "}
                                </Text>{" "}
                                <Button colorScheme="primary" size="xs" onClick={() => disconnect()}>
                                    Disconnect
                                </Button>
                            </>
                        )}
                    </HStack>
                </Card>
            </NoSSR>

            <NoSSR>
                <Container flex="1" display="flex" maxW={viewAllPanels() ? "100%" : "30%"}>
                    <SimpleGrid
                        columns={{ base: 1, md: 1, lg: viewAllPanels() ? 4 : 1, "2xl": viewAllPanels() ? 4 : 1 }}
                        gap="20px"
                        mb="20px"
                        mt="20px"
                    >
                        {viewAllPanels() && (
                            <Card
                                justifyContent="initial"
                                alignItems="left"
                                flexDirection="column"
                                w="100%"
                                mt="0px"
                                h="100%"
                            >
                                <Text
                                    me="auto"
                                    color={"secondaryGray.900"}
                                    fontSize="xl"
                                    fontWeight="700"
                                    lineHeight="100%"
                                    mb="5"
                                >
                                    Proposals
                                </Text>
                                {pollIds &&
                                    pollIds.map((number) => (
                                        <ListItem key={number.toString()} value={number.toString()} />
                                    ))}
                            </Card>
                        )}
                        {viewAllPanels() && (
                            <Card alignItems="left" flexDirection="column" w="100%" mb="0px">
                                <NoSSR>
                                    <Stack display="flex" width="100%">
                                        <Text
                                            me="auto"
                                            color={"secondaryGray.900"}
                                            fontSize="xl"
                                            fontWeight="700"
                                            lineHeight="100%"
                                            mb="5"
                                        >
                                            Proposal
                                        </Text>
                                        <Text color={"secondaryGray.800"} fontWeight="600">
                                            Id: {shortenAddress(pollId?.toString())}
                                        </Text>
                                        <Text color={"secondaryGray.900"} fontWeight="600">
                                            Details:
                                        </Text>
                                        <Text color={"secondaryGray.800"} fontWeight="600">
                                            {proposal ? parse(proposal) : ""}
                                        </Text>
                                    </Stack>
                                </NoSSR>
                            </Card>
                        )}
                        <Card
                            justifyContent="center"
                            alignItems="left"
                            flexDirection="column"
                            mb="0px"
                            h={viewAllPanels() ? "100%" : "300px"}
                        >
                            <Stack direction="column" h="100%">
                                <Text
                                    me="auto"
                                    color={"secondaryGray.900"}
                                    fontSize="xl"
                                    fontWeight="700"
                                    mt="0px"
                                    lineHeight="100%"
                                >
                                    Vote
                                </Text>
                                <Stack display="flex" width="100%">
                                    <Stack display="flex" width="95%" height="100%" mt="4">
                                        <Text color={"secondaryGray.800"} fontWeight="600">
                                            {helpText}
                                        </Text>
                                    </Stack>
                                    {connectionStateType == "CAST_SIGNAL" && (
                                        <RadioGroup onChange={setSelectedVote} value={selectedVote} pt="10">
                                            <Stack direction="row">
                                                <Card bg={"secondaryGray.600"} height="200px" px="5px" mx="auto">
                                                    <Flex
                                                        direction="column"
                                                        py="5px"
                                                        me="10px"
                                                        w="100%"
                                                        alignItems="center"
                                                        justifyContent="flex-end"
                                                        h="100%"
                                                    >
                                                        <Image
                                                            borderRadius="full"
                                                            boxSize="150px"
                                                            src="./yes.png"
                                                            alt="candidate1"
                                                            p="3"
                                                        />
                                                        <Radio
                                                            color={"primary.800"}
                                                            value={valueSignalYes}
                                                            colorScheme="green"
                                                        >
                                                            Yes
                                                        </Radio>
                                                    </Flex>
                                                </Card>
                                                <Card bg={"secondaryGray.600"} height="200px" px="5px" mx="auto">
                                                    <Flex
                                                        direction="column"
                                                        py="5px"
                                                        me="10px"
                                                        w="100%"
                                                        alignItems="center"
                                                        justifyContent="flex-end"
                                                        h="100%"
                                                    >
                                                        <Image
                                                            borderRadius="full"
                                                            boxSize="150px"
                                                            src="./no.png"
                                                            alt="candidate 2"
                                                            p="3"
                                                        />
                                                        <Radio
                                                            color={"primary.800"}
                                                            colorScheme="red"
                                                            value={valueSignalNo}
                                                        >
                                                            No
                                                        </Radio>
                                                    </Flex>
                                                </Card>
                                            </Stack>
                                        </RadioGroup>
                                    )}
                                </Stack>
                                <Stack alignItems="flex-end" justifyContent="flex-end" h="100%">
                                    <ZKPoHConnect
                                        theme={theme}
                                        onChangeState={handleChangeState}
                                        onLog={handleLog}
                                        signal={selectedVote}
                                        externalNullifier={pollId}
                                        {...zkPoHConfig}
                                    >
                                        Vote
                                    </ZKPoHConnect>
                                </Stack>
                            </Stack>
                        </Card>
                        {viewAllPanels() && (
                            <Card justifyContent="center" alignItems="center" flexDirection="column" w="100%" mb="0px">
                                <Text
                                    me="auto"
                                    color={"secondaryGray.900"}
                                    fontSize="xl"
                                    fontWeight="700"
                                    lineHeight="100%"
                                >
                                    Result of the vote
                                </Text>
                                <Stack alignItems="center" justifyContent="center" h="100%" w="90%">
                                    <Card
                                        bg={"secondaryGray.900"}
                                        flexDirection="column"
                                        w="100%"
                                        p="15px"
                                        px="20px"
                                        mt="15px"
                                        mx="auto"
                                    >
                                        <Flex direction="row" alignItems="center">
                                            <Flex direction="column" py="5px" w="50%" alignItems="center">
                                                <Flex align="center">
                                                    <Box h="8px" w="8px" bg="green.500" borderRadius="50%" me="4px" />
                                                    <Text
                                                        fontSize="xs"
                                                        color="secondaryGray.100"
                                                        fontWeight="700"
                                                        mb="5px"
                                                    >
                                                        Yes
                                                    </Text>
                                                </Flex>
                                                <Text fontSize="lg" color="secondaryGray.100" fontWeight="900">
                                                    ({votesPercentageYes}%)
                                                </Text>
                                            </Flex>
                                            <Flex direction="column" py="5px" me="10px" w="50%" alignItems="center">
                                                <Flex align="center">
                                                    <Box h="8px" w="8px" bg="red.600" borderRadius="50%" me="4px" />
                                                    <Text
                                                        fontSize="xs"
                                                        color="secondaryGray.100"
                                                        fontWeight="700"
                                                        mb="5px"
                                                    >
                                                        No
                                                    </Text>
                                                </Flex>
                                                <Text fontSize="lg" color="secondaryGray.100" fontWeight="900">
                                                    ({votesPercentageNo}%)
                                                </Text>
                                            </Flex>
                                        </Flex>
                                        <Flex direction="column" alignItems="center" pt="5">
                                            <Text fontSize="lg" color="secondaryGray.100" fontWeight="900">
                                                <b>Total votes:</b> {totalCount}
                                            </Text>
                                        </Flex>
                                    </Card>
                                </Stack>
                            </Card>
                        )}
                    </SimpleGrid>
                </Container>
            </NoSSR>
        </>
    );
}

type EtherScanLinkTProps = {
    children: React.ReactNode;
    address: string;
    network: string | undefined;
};

function EtherScanLink({ children, address, network }: EtherScanLinkTProps) {
    return (
        <Link color={colors.primary[400]} href={`https://${network}.etherscan.io/address/${address}`} isExternal>
            {children}
        </Link>
    );
}
