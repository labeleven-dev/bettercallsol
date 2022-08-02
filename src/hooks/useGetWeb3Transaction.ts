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
  start: (signature: IPubKey) => void;
  cancel: () => void;
} => {
  const [signature, setSignature] = useState("");
  const [inProgress, setInProgress] = useState(false);

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
        const status = await connection.getSignatureStatus(signature);
        if (status && status.value && onStatus) {
          onStatus(status.value);

          // TODO status from option?
          if (status.value?.confirmationStatus === "finalized") {
            const transaction = await connection.getTransaction(signature, {
              commitment: "finalized",
            });

            if (transaction) {
              setFinalisedAt(new Date().getTime());
              setInProgress(false);
              onFinalised && onFinalised(transaction);
            }
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
    start: (signature) => {
      setSignature(signature);
      setStartedAt(new Date().getTime());
      setFinalisedAt(undefined);
      setInProgress(true);
    },
    cancel: () => {
      setInProgress(false);
    },
  };
};
