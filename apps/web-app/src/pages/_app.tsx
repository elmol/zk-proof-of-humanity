import LogsContext from "@/context/LogsContext"
import { ChakraProvider, Container, HStack, Spinner, Stack, Text } from "@chakra-ui/react"
import type { AppProps } from "next/app"
import Head from "next/head"
import { useState } from "react"
import theme from "../styles/index"

export default function App({ Component, pageProps }: AppProps) {
    const [_logs, setLogs] = useState<string>("")


    return (
        <>
            <Head>
                <title>ZK Proof of Humanity</title>
                <link rel="icon" href="/favicon.ico" />
                {/* <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#ebedff" /> */}
            </Head>

            <ChakraProvider theme={theme}>
                            <LogsContext.Provider
                                value={{
                                    _logs,
                                    setLogs
                                }}
                            >
                                <Component {...pageProps} />
                            </LogsContext.Provider>

                <HStack
                    flexBasis="56px"
                    borderTop="1px solid #8f9097"
                    backgroundColor="#DAE0FF"
                    align="center"
                    justify="center"
                    spacing="4"
                    p="4"
                >
                    {_logs.endsWith("...") && <Spinner color="primary.400" />}
                    <Text fontWeight="bold">{_logs || `⭐ ⭐ ⭐ `}</Text>
                </HStack>
            </ChakraProvider>
        </>
    )
}
