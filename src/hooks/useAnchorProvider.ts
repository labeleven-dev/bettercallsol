import { AnchorProvider } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { useMemo } from "react";
import { usePersistentStore } from "./usePersistentStore";
import { useWeb3Connection } from "./useWeb3Connection";

export const useAnchorProvider = (
  connection?: Connection
): {
  provider?: AnchorProvider;
  connection?: Connection;
} => {
  const { maxRetries, preflightCommitment, skipPreflight } = usePersistentStore(
    (state) => state.transactionOptions
  );

  const defaultConnection = useWeb3Connection();
  const activeConnection = connection || defaultConnection;

  const { publicKey, signTransaction, signAllTransactions } = useWallet();

  const provider = useMemo(() => {
    if (!activeConnection || !publicKey) return undefined;
    return new AnchorProvider(
      activeConnection,
      {
        publicKey,
        signTransaction: signTransaction!,
        signAllTransactions: signAllTransactions!,
      },
      {
        maxRetries,
        preflightCommitment,
        skipPreflight,
      }
    );
  }, [
    activeConnection,
    publicKey,
    signTransaction,
    signAllTransactions,
    maxRetries,
    preflightCommitment,
    skipPreflight,
  ]);

  return {
    provider,
    connection: activeConnection,
  };
};
