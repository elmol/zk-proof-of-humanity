import { Link } from "@chakra-ui/react";
import colors from "@/styles/colors";

type EtherScanLinkTProps = {
    children: React.ReactNode;
    address: string;
    network: string | undefined;
};

export function EtherScanLink({ children, address, network }: EtherScanLinkTProps) {
    return (
        <Link color={colors.primary[400]} href={`https://${network}.etherscan.io/address/${address}`} isExternal>
            {children}
        </Link>
    );
}
