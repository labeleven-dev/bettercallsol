import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  ChakraProvider,
  Flex,
  Hide,
  Show,
} from "@chakra-ui/react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import React, { useMemo } from "react";
import { Transaction } from "./components/client/Transaction";
import { Footer } from "./components/Footer";
import { Header } from "./components/header/Header";
import { Options } from "./components/options/Options";
import { Palette } from "./components/palette/Palette";
import { usePersistentStore } from "./hooks/usePersistentStore";
import { useSessionStore } from "./hooks/useSessionStore";
import theme from "./theme";

require("@solana/wallet-adapter-react-ui/styles.css");

export const App: React.FC = () => {
  const paletteOpen = useSessionStore((state) => state.uiState.paletteOpen);
  const {
    transactionOptions: {
      rpcEndpoint,
      commitment,
      confirmTransactionInitialTimeout,
      disableRetryOnRateLimit,
    },
    appOptions: { autoConnectWallet },
  } = usePersistentStore((state) => state);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({
        network: rpcEndpoint.network as WalletAdapterNetwork,
      }),
      new TorusWalletAdapter(),
    ],
    [rpcEndpoint]
  );

  return (
    <ChakraProvider theme={theme}>
      <ConnectionProvider
        endpoint={rpcEndpoint.url}
        config={{
          commitment,
          confirmTransactionInitialTimeout,
          disableRetryOnRateLimit,
        }}
      >
        <WalletProvider wallets={wallets} autoConnect={autoConnectWallet}>
          <WalletModalProvider>
            <Flex flexDirection="column">
              {/* 
                  header and footer fixed and span the entire page width
                  Transaction and palette are independently scrollable
               */}

              <Box h="55px" w="full" position="fixed" zIndex="modal">
                <Header />
              </Box>

              <Flex mt="55px">
                <Box flex="10" h="93vh" overflow="scroll">
                  {/* TODO it's Solana wallet button's fault, we need to replace it */}
                  <Show below="md">
                    <Alert status="warning" variant="left-accent">
                      <AlertIcon />
                      <AlertDescription>
                        This app is optimised for desktop. It may look wonky on
                        your mobile device.
                      </AlertDescription>
                    </Alert>
                  </Show>
                  <Transaction />
                </Box>
                {paletteOpen && (
                  <Hide below="md">
                    <Box flex="5" h="93vh" overflow="scroll">
                      <Palette />
                    </Box>
                  </Hide>
                )}
              </Flex>

              <Box
                position="fixed"
                bottom="0px"
                h="40px"
                w="full"
                zIndex="modal"
              >
                <Footer />
              </Box>
            </Flex>

            <Options />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ChakraProvider>
  );
};
