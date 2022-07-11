import { useInterval } from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useTransactionStore } from "../store";
import { mapTransaction } from "../web3";

/**
 * The actual logic of sending a transaction to the chain.
 *
 * All the required info is gathered from `useConnection`, `useWallet`,
 * and `useTransactionStore` hooks.
 *
 * @returns the function that will run the transaction
 */
export const useTransaction: () => () => void = () => {
  const transactionOptions = useTransactionStore(
    (state) => state.transactionOptions
  );
  const transactionData = useTransactionStore((state) => state.transaction);
  const results = useTransactionStore((state) => state.results);
  const appOptions = useTransactionStore((state) => state.appOptions);
  const set = useTransactionStore((state) => state.set);

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  useInterval(
    async () => {
      try {
        const status = await connection.getSignatureStatus(results?.signature);
        if (status) {
          set((state) => {
            state.results.slot = status.value?.slot;
            state.results.confirmationStatus = status.value?.confirmationStatus;
            state.results.confirmations = status.value?.confirmations!;
          });

          if (status.value?.confirmationStatus === "finalized") {
            const transaction = await connection.getTransaction(
              results.signature,
              { commitment: "finalized" }
            );

            if (transaction) {
              const { accountKeys } = transaction.transaction.message;
              const { logMessages, err, fee, preBalances, postBalances } =
                transaction.meta!;

              // determine balances
              const accounts = Object.values(
                transactionData.instructions
              ).flatMap((instruction) => Object.values(instruction.accounts));
              let balances = accountKeys.map((address, index) => ({
                address: address.toBase58(),
                names: accounts
                  .filter(
                    (account) =>
                      account.pubkey === address.toBase58() && account.name
                  )
                  .map((account) => account.name!),
                before: preBalances[index],
                after: postBalances[index],
              }));

              set((state) => {
                state.results = {
                  inProgress: false,
                  signature: results.signature,
                  confirmationStatus: "finalized",
                  slot: transaction?.slot,
                  balances,
                  logs: logMessages || [],
                  error: err as string,
                  fee,
                };
              });
            }
          }
        }

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
      } catch (e) {
        // TODO
      }
    },
    results.inProgress ? appOptions.pollingPeriod : null
  );

  const transact = async () => {
    if (
      !transactionData.instructions ||
      Object.values(transactionData.instructions).every((x) => x.disabled)
    ) {
      set((state) => {
        state.results.error = "No instructions provided";
      });
      return;
    }
    if (!publicKey) {
      set((state) => {
        state.results.error = "Wallet is not connected";
      });
      return;
    }

    set((state) => {
      state.results = {
        inProgress: true,
        signature: "",
        startedAt: new Date().getTime(),
      };
    });

    try {
      const transaction = mapTransaction(transactionData);
      const signature = await sendTransaction(transaction, connection, {
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
