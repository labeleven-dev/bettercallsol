import {
  Alert,
  AlertIcon,
  Box,
  Collapse,
  Divider,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Grid,
  Heading,
  Icon,
  IconButton,
  Spacer,
  Tooltip,
  useInterval,
} from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React from "react";
import { FaExpand, FaExpandAlt, FaPlay } from "react-icons/fa";
import { useTransactionStore } from "../../store";
import { mapTransaction } from "../../web3";
import { Instructions } from "./Instructions";
import { NetworkSelector } from "./NetworkSelector";
import { Results } from "./Results";

export const Transaction: React.FC = () => {
  const transactionOptions = useTransactionStore(
    (state) => state.transactionOptions
  );
  const transcationOptions = useTransactionStore(
    (state) => state.transactionOptions
  );
  const transactionData = useTransactionStore((state) => state.transaction);
  const results = useTransactionStore((state) => state.results);
  const appOptions = useTransactionStore((state) => state.appOptions);
  const set = useTransactionStore((state) => state.set);

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  // TODO refactor

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

    const transaction = mapTransaction(transactionData);
    try {
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

  return (
    <Grid m="2">
      <Box p="5">
        <Flex mb="5">
          <Tooltip label="Click to edit" placement="top-start">
            <Editable
              defaultValue={transactionData.name}
              onChange={(value) =>
                set((state) => {
                  state.transaction.name = value;
                })
              }
            >
              <Heading size="md">
                <EditablePreview minW="20px" />
                <EditableInput />
              </Heading>
            </Editable>
          </Tooltip>
          <Spacer />
          <Tooltip label="Expand All">
            <IconButton
              ml="2"
              aria-label="Expand All"
              icon={<Icon as={FaExpandAlt} />}
              variant="ghost"
              onClick={() => {
                set((state) => {
                  Object.keys(state.transaction.instructions).forEach((id) => {
                    state.transaction.instructions[id].expanded = true;
                  });
                });
              }}
            />
          </Tooltip>
          <Tooltip label="Collapse All">
            <IconButton
              mr="2"
              aria-label="Collapse All"
              icon={<Icon as={FaExpand} />}
              variant="ghost"
              onClick={() => {
                set((state) => {
                  Object.keys(state.transaction.instructions).forEach((id) => {
                    state.transaction.instructions[id].expanded = false;
                  });
                });
              }}
            />
          </Tooltip>
          <NetworkSelector />
          <Tooltip label="Run Program">
            <IconButton
              isLoading={results.inProgress}
              ml="2"
              mr="2"
              colorScheme="main"
              color="main.500"
              borderWidth="2px"
              variant="outline"
              aria-label="Run Program"
              icon={<Icon as={FaPlay} />}
              onClick={transact}
            />
          </Tooltip>
        </Flex>

        <Collapse
          in={transcationOptions.network.id === "mainnet-beta"}
          unmountOnExit
        >
          <Alert
            mb="2"
            fontSize="sm"
            rounded="sm"
            status="warning"
            variant="left-accent"
          >
            <AlertIcon />
            This app is currently in active development. Use MAINNET at your own
            risk.
          </Alert>
        </Collapse>

        <Instructions />
      </Box>
      <Divider />
      <Box mt="5">
        <Results />
      </Box>
    </Grid>
  );
};
