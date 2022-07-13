import {
  Alert,
  AlertDescription,
  AlertIcon,
  ChakraProvider,
  Flex,
  Show,
  Spacer,
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
import { Options } from "./components/options/Options";
import { TopBar } from "./components/TopBar";
import { useTransactionStore } from "./hooks/useTransactionStore";
import theme from "./theme";

require("@solana/wallet-adapter-react-ui/styles.css");

export const App: React.FC = () => {
  const {
    network,
    commitment,
    confirmTransactionInitialTimeout,
    disableRetryOnRateLimit,
  } = useTransactionStore((state) => state.transactionOptions);

  // TODO support RPC URL
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({
        network: network.id as WalletAdapterNetwork,
      }),
      new TorusWalletAdapter(),
    ],
    [network]
  );

  return (
    <ChakraProvider theme={theme}>
      <ConnectionProvider
        endpoint={network.url}
        config={{
          commitment,
          confirmTransactionInitialTimeout,
          disableRetryOnRateLimit,
        }}
      >
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <Flex flexDirection="column" minH="100vh">
              {/* TODO it's Solana wallet button's fault, we need to replace it */}
              <Show below="sm">
                <Alert status="warning" variant="left-accent">
                  <AlertIcon />
                  <AlertDescription>
                    This app is optimised for desktop. It may look wonky on your
                    mobile device.
                  </AlertDescription>
                </Alert>
              </Show>
              <TopBar />
              <Transaction />
              <Spacer />
              <Footer />
              <Options />
            </Flex>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ChakraProvider>
  );
};
