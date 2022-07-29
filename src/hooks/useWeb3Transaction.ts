import { useInterval } from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Signer } from "@solana/web3.js";
import {
  mapFromSignatureStatus,
  mapFromTransactionResponse,
  mapToTransaction,
} from "../models/web3js-mappers";
import { useMemoryOnlyState } from "./useMemoryOnlyStore";
import { useOptionsStore } from "./useOptionsStore";
import { useTransactionStore } from "./useTransactionStore";

/**
 * The actual logic of sending a transaction to the chain.
 *
 * All the required info is gathered from `useConnection`, `useWallet`,
 * and `useTransactionStore` hooks.
 *
 * @returns the function that will run the transaction
 */
export const useWeb3Transaction: () => () => void = () => {
  const transactionOptions = useOptionsStore(
    (state) => state.transactionOptions
  );
  const {
    transaction: transactionData,
    results,
    uiState,
    set,
  } = useTransactionStore((state) => state);
  const keypairs = useMemoryOnlyState((state) => state.keypairs);
  const { connection } = useConnection();
  const { sendTransaction } = useWallet();

  // check if transaction is finalised, then fetch the confirmed transaction
  // and populate the global state.
  useInterval(
    async () => {
      if (!results.signature) {
        return;
      }

      try {
        const status = await connection.getSignatureStatus(results?.signature);
        if (status && status.value) {
          set((state) => {
            state.results = {
              ...state.results,
              ...mapFromSignatureStatus(status.value!),
            };
          });

          // finalised - let's get the transaction details
          if (status.value?.confirmationStatus === "finalized") {
            const transaction = await connection.getTransaction(
              results.signature,
              { commitment: "finalized" }
            );

            if (transaction) {
              set((state) => {
                state.results = mapFromTransactionResponse(transaction);
              });
            }
          }
        }

        // check if timeout and stop
        // TODO this should be reflected in confirmation status, not transaction error
        if (
          results.startedAt! + transactionOptions.confirmTransactionTimeout <
          new Date().getTime()
        ) {
          set((state) => {
            state.results = {
              inProgress: false,
              signature: "",
              error: `Transcation failed to confirm in ${
                transactionOptions.confirmTransactionTimeout / 1000
              } seconds`,
            };
          });
        }
      } catch (err) {
        // this will fail a few times till transaction is confirmed?
      }
    },
    results.inProgress ? transactionOptions.pollingPeriod : null
  );

  // send the transaction to the chain
  const transact = async () => {
    if (
      !transactionData.instructions ||
      Object.values(uiState.instructions).every((x) => x.disabled)
    ) {
      set((state) => {
        state.results.error = "No instructions provided";
      });
      return;
    }

    set((state) => {
      state.results = {
        inProgress: true,
        signature: "",
        error: "",
        startedAt: new Date().getTime(),
      };
    });

    try {
      const transaction = mapToTransaction(
        transactionData,
        uiState.instructions
      );

      // add additional signers
      const signerPubkeys = Object.values(transactionData.instructions.map)
        .flatMap((instruction) => Object.values(instruction.accounts.map))
        .filter((account) => account.isSigner && keypairs[account.pubkey])
        .map((account) => account.pubkey);

      const additionalSigners = [...new Set(signerPubkeys)].map(
        (pubkey) =>
          ({
            publicKey: new PublicKey(pubkey),
            secretKey: keypairs[pubkey],
          } as Signer)
      );

      const signature = await sendTransaction(transaction, connection, {
        signers: additionalSigners || undefined,
        skipPreflight: transactionOptions.skipPreflight,
        maxRetries: transactionOptions.maxRetries,
        preflightCommitment: transactionOptions.preflightCommitment,
      });
      set((state) => {
        state.results.signature = signature;
      });
    } catch (err) {
      set((state) => {
        state.results.error = (err as { message: string }).message;
        state.results.inProgress = false;
      });
    }
  };

  return transact;
};
