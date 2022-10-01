import { BackpackWalletAdapter } from "@solana/wallet-adapter-backpack";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { BraveWalletAdapter } from "@solana/wallet-adapter-brave";
import { GlowWalletAdapter } from "@solana/wallet-adapter-glow";
import { LedgerWalletAdapter } from "@solana/wallet-adapter-ledger";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import React, { useMemo } from "react";
import { useShallowConfigStore } from "../../hooks/useConfigStore";
import { useSessionStoreWithUndo } from "../../hooks/useSessionStore";

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const rpcEndpoint = useSessionStoreWithUndo((state) => state.rpcEndpoint);
  const [
    confirmTransactionInitialTimeout,
    disableRetryOnRateLimit,
    autoConnectWallet,
  ] = useShallowConfigStore((state) => [
    state.transactionOptions.confirmTransactionInitialTimeout,
    state.transactionOptions.disableRetryOnRateLimit,
    state.appOptions.autoConnectWallet,
  ]);

  const wallets = useMemo(
    () => [
      new BackpackWalletAdapter(),
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
