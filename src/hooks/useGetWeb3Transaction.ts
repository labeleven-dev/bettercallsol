import { useInterval } from "@chakra-ui/react";
import {
  Connection,
  SignatureStatus,
  VersionedTransactionResponse,
} from "@solana/web3.js";
import { useConfigStore } from "hooks/useConfigStore";
import { useWeb3Connection } from "hooks/useWeb3Connection";
import { useState } from "react";
import { IPubKey } from "types/internal";

/**
 * Use it to poll for the results of a transaction
 */
export const useGetWeb3Transaction = ({
  connection,
  onStatus,
  onSuccess,
  onTimeout,
  onError,
}: {
  connection?: Connection;
  onStatus?: (status: SignatureStatus) => void;
  onSuccess?: (response: VersionedTransactionResponse) => void;
  onTimeout?: () => void;
  onError?: (error: Error) => void;
}): {
  signature: IPubKey;
  inProgress: boolean;
  startedAt?: number;
  endedAt?: number;
  start: (signature: IPubKey, skipPolling?: boolean) => void;
  cancel: () => void;
} => {
  const [signature, setSignature] = useState("");
  const [inProgress, setInProgress] = useState(false);
  const [skipPolling, setSkipPolling] = useState(false);

  const [startedAt, setStartedAt] = useState<number>();
  const [endedAt, setFinalisedAt] = useState<number>();

  const transactionOptions = useConfigStore(
    (state) => state.transactionOptions
  );
  const defaultConnection = useWeb3Connection();
  const activeConnection = connection || defaultConnection;

  useInterval(
    async () => {
      if (!signature) {
        return;
      }

      try {
        let status: SignatureStatus | null = null;
        if (!skipPolling) {
          status = (await activeConnection.getSignatureStatus(signature)).value;
          if (status && onStatus) {
            onStatus(status);
          }
        }

        if (
          skipPolling ||
          status?.confirmationStatus === transactionOptions.finality
        ) {
          const transaction = await activeConnection.getTransaction(signature, {
            maxSupportedTransactionVersion: 0,
            commitment: transactionOptions.finality,
          });

          if (transaction) {
            setFinalisedAt(new Date().getTime());
            setInProgress(false);
            onSuccess && onSuccess(transaction);
          } else {
            setInProgress(false);
            onError && onError(new Error("Transaction not found"));
          }
        }

        // check if timeout and stop
        if (
          startedAt! + transactionOptions.confirmTransactionTimeout <
          new Date().getTime()
        ) {
          setInProgress(false);
          onTimeout && onTimeout();
        }
      } catch (err) {
        setInProgress(false);
        onError && onError(err as Error);
      }
    },
    inProgress ? transactionOptions.pollingPeriod : null
  );

  return {
    signature,
    inProgress,
    startedAt,
    endedAt,
    start: (signature, skipPolling = false) => {
      setStartedAt(new Date().getTime());
      setSignature(signature);
      setSkipPolling(skipPolling);
      setFinalisedAt(undefined);
      setInProgress(true);
    },
    cancel: () => {
      setInProgress(false);
    },
  };
};
