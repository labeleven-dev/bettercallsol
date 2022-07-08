import {
  Box,
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
  useColorModeValue,
  useInterval,
} from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React from "react";
import { FaExpandArrowsAlt, FaPlay } from "react-icons/fa";
import { useTransactionStore } from "../../store";
import { mapTransaction } from "../../web3";
import { Instructions } from "./Instructions";
import { NetworkSelector } from "./NetworkSelector";
import { Results } from "./Results";

export const Transaction: React.FC = () => {
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
        const status = await connection.getSignatureStatus(results?.signature!);
        if (status) {
          set((state) => {
            state.results.slot = status.value?.slot;
            state.results.confirmationStatus = status.value?.confirmationStatus;
            state.results.confirmations = status.value?.confirmations!;
          });

          if (status.value?.confirmationStatus === "finalized") {
            const transaction = await connection.getTransaction(
              results.signature!,
              { commitment: "finalized" }
            );

            if (transaction) {
              const { logMessages, err, fee } = transaction.meta!;
              set((state) => {
                state.results = {
                  inProgress: false,
                  confirmationStatus: "finalized",
                  slot: transaction?.slot,
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
    if (!publicKey) {
      set((state) => {
        state.results.error = "Wallet is not connected";
      });
      return;
    }

    set((state) => {
      state.results = { inProgress: true, startedAt: new Date().getTime() };
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
      });
    }
  };

  return (
    <Grid m="2">
      <Box
        p="5"
        border="1px"
        rounded="md"
        borderColor={useColorModeValue("gray.200", "gray.600")}
      >
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
            {/* TODO Switch to Collapse All and another icon */}
            <IconButton
              ml="2"
              mr="2"
              aria-label="Expand All"
              icon={<Icon as={FaExpandArrowsAlt} />}
              variant="ghost"
            />
          </Tooltip>
          <NetworkSelector />
          <Tooltip label="Run Program">
            <IconButton
              isLoading={results.inProgress}
              ml="2"
              mr="2"
              colorScheme="main"
              variant="outline"
              aria-label="Run Program"
              icon={<Icon as={FaPlay} onClick={transact} />}
            />
          </Tooltip>
        </Flex>
        <Instructions />
      </Box>
      <Box mt="2">
        <Results />
      </Box>
    </Grid>
  );
};
