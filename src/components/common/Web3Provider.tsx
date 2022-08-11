import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  BraveWalletAdapter,
  GlowWalletAdapter,
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
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
      // TODO Attempted import error: 'BackpackWalletAdapter' is not exported from '@solana/wallet-adapter-wallets' (imported as 'BackpackWalletAdapter').
      // new BackpackWalletAdapter(),
      new BraveWalletAdapter(),
      new GlowWalletAdapter(),
      new LedgerWalletAdapter(),
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({
        network: rpcEndpoint.network as WalletAdapterNetwork,
      }),
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
