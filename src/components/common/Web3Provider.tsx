import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import React, { useMemo } from "react";
import { usePersistentStore } from "../../hooks/usePersistentStore";
import { useSessionStoreWithUndo } from "../../hooks/useSessionStore";

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const rpcEndpoint = useSessionStoreWithUndo((state) => state.rpcEndpoint);
  const [
    confirmTransactionInitialTimeout,
    disableRetryOnRateLimit,
    autoConnectWallet,
  ] = usePersistentStore((state) => [
    state.transactionOptions.confirmTransactionInitialTimeout,
    state.transactionOptions.disableRetryOnRateLimit,
    state.appOptions.autoConnectWallet,
  ]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SolflareWalletAdapter({
        network: rpcEndpoint.network as WalletAdapterNetwork,
      }),
      new TorusWalletAdapter(),
    ],
    [rpcEndpoint]
  );

  return (
    <ConnectionProvider
      endpoint={rpcEndpoint.url}
      config={{
        confirmTransactionInitialTimeout,
        disableRetryOnRateLimit,
      }}
    >
      <WalletProvider wallets={wallets} autoConnect={autoConnectWallet}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
