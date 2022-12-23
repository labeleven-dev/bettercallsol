import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { BraveWalletAdapter } from "@solana/wallet-adapter-brave";
import { GlowWalletAdapter } from "@solana/wallet-adapter-glow";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { useShallowConfigStore } from "hooks/useConfigStore";
import { useSessionStoreWithUndo } from "hooks/useSessionStore";
import React, { useMemo } from "react";

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
      new BraveWalletAdapter(),
      new GlowWalletAdapter(),
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
