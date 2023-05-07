import { publicProvider } from "@wagmi/core/providers/public";
import { Inter } from "next/font/google";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { goerli, localhost, sepolia } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import Main from "../components/Main";

const inter = Inter({ subsets: ["latin"] });

const { chains, provider } = configureChains([sepolia, goerli, localhost], [publicProvider()]);

const client = createClient({
    autoConnect: true,
    connectors: [new InjectedConnector({ chains })],
    provider,
});

export default function Home() {
    return (
        <>
            <WagmiConfig client={client}>
                <Main />
            </WagmiConfig>
        </>
    );
}
