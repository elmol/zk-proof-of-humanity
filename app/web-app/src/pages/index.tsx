import { publicProvider } from "@wagmi/core/providers/public";
import { Inter } from "next/font/google";
import Head from "next/head";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { goerli, localhost } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import Main from "../components/Main";

const inter = Inter({ subsets: ["latin"] });

const { chains, provider } = configureChains([goerli, localhost], [publicProvider()]);

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
