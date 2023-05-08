import { publicProvider } from "@wagmi/core/providers/public";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { localhost, sepolia } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import Main from "../components/Main";

const { chains, provider } = configureChains([sepolia, localhost], [publicProvider()]);

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
