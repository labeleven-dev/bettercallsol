import { Box, Divider, Grid } from "@chakra-ui/react";
import { AddressLookupTables } from "components/client/AddressLookupTables";
import { ClientHeader } from "components/client/ClientHeader";
import { Instructions } from "components/client/Instructions";
import { Results } from "components/client/results/Results";
import { SendButton } from "components/client/SendButton";
import { useGetWeb3Transaction } from "hooks/useGetWeb3Transaction";
import { useShallowSessionStoreWithoutUndo } from "hooks/useSessionStore";
import {
  extractBalances,
  mapWeb3TransactionError,
} from "mappers/web3js-to-internal";
import React, { useRef } from "react";

export const Client: React.FC = () => {
  const set = useShallowSessionStoreWithoutUndo((state) => state.set);

  // used for scrolling to results
  const resultsRef = useRef<HTMLDivElement>(null);

  // get transaction results from the chain
  const { start, cancel, endedAt } = useGetWeb3Transaction({
    onStatus: ({ slot, confirmationStatus, confirmations, err }) => {
      set((state) => {
        state.transactionRun = {
          ...state.transactionRun,
          slot,
          confirmationStatus,
          confirmations: confirmations || undefined,
          error: mapWeb3TransactionError(err),
        };
      });
    },
    onSuccess: (response) => {
      set((state) => {
        state.transactionRun = {
          ...state.transactionRun,
          inProgress: false,
          confirmationStatus: "finalized",
          blockTime: response.blockTime || undefined,
          slot: response.slot,
          balances: extractBalances(response),
          logs: response.meta?.logMessages || [],
          error: mapWeb3TransactionError(response.meta?.err),
          fee: response.meta?.fee,
        };
      });
    },
    onTimeout: () => {
      set((state) => {
        state.transactionRun.inProgress = false;
      });
    },
    onError: (error) => {
      set((state) => {
        state.transactionRun.error = error.message;
        state.transactionRun.inProgress = false;
      });
    },
  });

  const startGet = (signature: string, skipPolling: boolean = false) => {
    if (!signature) return;
    set((state) => {
      state.transactionRun = {
        inProgress: true,
        signature,
        // set prior to transaction submission so needs to be preserved
        recentBlockhash: state.transactionRun.recentBlockhash,
        lastValidBlockHeight: state.transactionRun.lastValidBlockHeight,
      };
    });
    start(signature, skipPolling);
  };

  const cancelGet = () => {
    cancel();
    set((state) => {
      state.transactionRun.inProgress = false;
    });
  };

  return (
    <Grid m="2">
      <Box p="5">
        {/* TODO split ClientHeader from TransactionHeader, without causing excessive reloads */}
        <ClientHeader
          sendButton={
            <SendButton resultsRef={resultsRef} startGet={startGet} />
          }
        />
        <AddressLookupTables />
        <Instructions />
      </Box>

      <Divider />

      <Box mt="5">
        <Results
          ref={resultsRef}
          startGet={startGet}
          cancelGet={cancelGet}
          endedAt={endedAt}
        />
      </Box>
    </Grid>
  );
};
