import { Text } from "@chakra-ui/react";
import NextLink from "next/link";
import Card from "./Card";

function ListItem(props: { value: string }) {
    // Correct! There is no need to specify the key here:
    return (
        <NextLink
            href={{
                pathname: "/",
                query: { pollId: props.value },
            }}
        >
            <Card
                _hover={{
                    background: "secondaryGray.800",
                    color: "teal.500",
                }}
                alignItems="left"
                flexDirection="column"
                w="100%"
                mb="0px"
                bg={"secondaryGray.900"}
                p="15px"
                px="20px"
                mt="15px"
                mx="auto"
            >
                <Text color={"secondaryGray.100"} fontWeight="600">
                    Id: {shortenAddress(props.value?.toString())}
                </Text>
            </Card>
        </NextLink>
    );
}

function shortenAddress(address: string | undefined | any) {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default ListItem;
