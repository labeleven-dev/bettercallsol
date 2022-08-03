import { useInterval } from "@chakra-ui/react";
import { useConnection } from "@solana/wallet-adapter-react";
import { SignatureStatus, TransactionResponse } from "@solana/web3.js";
import { useState } from "react";
import { IPubKey } from "../models/internal-types";
import { usePersistentStore } from "./usePersistentStore";

export const useGetWeb3Transaction = ({
  onStatus,
  onFinalised,
  onTimeout,
  onError,
}: {
  onStatus?: (status: SignatureStatus) => void;
  onFinalised?: (response: TransactionResponse) => void;
  onTimeout?: () => void;
  onError?: (error: Error) => void;
}): {
  signature: IPubKey;
  inProgress: boolean;
  startedAt?: number;
  finalisedAt?: number;
  start: (signature: IPubKey, skipPolling?: boolean) => void;
  cancel: () => void;
} => {
  const [signature, setSignature] = useState("");
  const [inProgress, setInProgress] = useState(false);
  const [skipPolling, setSkipPolling] = useState(false);

  const [startedAt, setStartedAt] = useState<number>();
  const [finalisedAt, setFinalisedAt] = useState<number>();

  const transactionOptions = usePersistentStore(
    (state) => state.transactionOptions
  );
  const { connection } = useConnection();

  useInterval(
    async () => {
      if (!signature) {
        return;
      }

      try {
        let status: SignatureStatus | null = null;
        if (!skipPolling) {
          status = (await connection.getSignatureStatus(signature)).value;
          if (status && onStatus) {
            onStatus(status);
          }
        }

        // TODO status from option?
        if (skipPolling || status?.confirmationStatus === "finalized") {
          const transaction = await connection.getTransaction(signature, {
            commitment: "finalized",
          });

          if (transaction) {
            setFinalisedAt(new Date().getTime());
            setInProgress(false);
            onFinalised && onFinalised(transaction);
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
    finalisedAt,
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
