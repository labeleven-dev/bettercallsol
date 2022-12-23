import { useConnection } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { useConfigStore } from "hooks/useConfigStore";
import { useMemo } from "react";

/**
 * Returns a Solana connection for the given RPC URL,
 * or just the default one used for the client
 */
export const useWeb3Connection = (rpcEndpointUrl?: string): Connection => {
  const transactionOptions = useConfigStore(
    (state) => state.transactionOptions
  );
  const { connection: defaultConnection } = useConnection();
  const customConnection = useMemo(() => {
    if (!rpcEndpointUrl) return null;

    const { confirmTransactionInitialTimeout, disableRetryOnRateLimit } =
      transactionOptions;
    return new Connection(rpcEndpointUrl, {
      confirmTransactionInitialTimeout,
      disableRetryOnRateLimit,
    });
  }, [rpcEndpointUrl, transactionOptions]);
  return customConnection || defaultConnection;
};
