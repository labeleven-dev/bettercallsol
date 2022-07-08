import { ChakraProvider, Flex, Spacer } from "@chakra-ui/react";
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
import { TopBar } from "./components/TopBar";
import { useTransactionStore } from "./store";
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
              <TopBar />
              <Transaction />
              <Spacer />
              <Footer />
            </Flex>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ChakraProvider>
  );
};
