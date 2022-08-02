import {
  CheckCircleIcon,
  QuestionIcon,
  RepeatIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Grid,
  Heading,
  IconButton,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Tooltip,
} from "@chakra-ui/react";
import { TransactionConfirmationStatus } from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import { useGetWeb3Transaction } from "../../../hooks/useGetWeb3Transaction";
import { useSessionStoreWithoutUndo } from "../../../hooks/useSessionStore";
import { IBalance } from "../../../models/internal-types";
import {
  mapBalances,
  mapTransactionError,
} from "../../../models/web3js-mappers";
import { ErrorAlert } from "../../common/ErrorAlert";
import { BalanceTable } from "./BalanceTable";
import { ProgramLogs } from "./ProgramLogs";
import { Signature } from "./Signature";

type State = {
  slot?: number;
  confirmations?: number;
  confirmationStatus?: TransactionConfirmationStatus;
  blockTime?: number;
  fee?: number;
  balances?: IBalance[];
  error?: string;
  logs?: string[];
};

export const Results: React.FC = () => {
  const [results, setResults] = useState<State>({});

  const setInProgress = useSessionStoreWithoutUndo(
    (state) => (value: boolean) => {
      state.set((state) => {
        state.transactionRun.inProgress = value;
      });
    }
  );

  const {
    signature,
    inProgress,
    finalisedAt,
    start: startWeb3Transaction,
    cancel: cancelWeb3Transaction,
  } = useGetWeb3Transaction({
    onStatus: ({ slot, confirmationStatus, confirmations, err }) => {
      setResults({
        ...results,
        slot,
        confirmationStatus,
        confirmations: confirmations || undefined,
        error: mapTransactionError(err),
      });
    },
    onFinalised: (response) => {
      setResults({
        confirmationStatus: "finalized",
        blockTime: response.blockTime || undefined,
        slot: response.slot,
        balances: mapBalances(response),
        logs: response.meta?.logMessages || [],
        error: mapTransactionError(response.meta?.err),
        fee: response.meta?.fee,
      });
      setInProgress(false);
    },
    onTimeout: () => {
      setInProgress(false);
    },
    onError: (error) => {
      setResults({
        ...results,
        error: error.message,
      });
      setInProgress(false);
    },
  });

  const start = (signature: string) => {
    if (!signature) return;
    setResults({});
    startWeb3Transaction(signature);
  };

  // start confirming the tranaction when signature is set
  // by TransactionHeader component
  useEffect(() => {
    useSessionStoreWithoutUndo.subscribe(
      (state) => state.transactionRun.signature,
      start
    );
  });

  const cancel = () => {
    cancelWeb3Transaction();
    setInProgress(false);
  };

  return (
    <Grid p="5">
      <Flex>
        <Heading mb="6" mr="3" size="md">
          Results
        </Heading>
        {results.confirmationStatus === "finalized" ? (
          results.error ? (
            <Tooltip label="Failed Transaction">
              <WarningIcon mt="0.5" mr="1" color="red.400" />
            </Tooltip>
          ) : (
            <Tooltip label="Successful Transction">
              <CheckCircleIcon mt="1" mr="1" color="green.400" />
            </Tooltip>
          )
        ) : (
          signature &&
          !inProgress && (
            <Tooltip label="Unknown Transaction Status">
              <QuestionIcon mt="1" mr="1" color="yellow.400" />
            </Tooltip>
          )
        )}

        <Spacer />

        {results.confirmationStatus && (
          <Tag
            mr="1"
            colorScheme={
              results.confirmationStatus === "processed"
                ? "yellow"
                : results.confirmationStatus === "confirmed"
                ? "blue"
                : "green"
            }
            height="20px"
          >
            {results.confirmationStatus === "processed"
              ? "Processed"
              : results.confirmationStatus === "confirmed"
              ? `Confirmed by ${results.confirmations || 0}`
              : `Finalised by max confirmations`}
          </Tag>
        )}
        {finalisedAt && (
          <Tooltip
            label={`Last fetched @ ${new Date(finalisedAt).toLocaleString()}`}
          >
            <Tag height="20px" variant="outline">
              {new Date(finalisedAt).toLocaleTimeString()}
            </Tag>
          </Tooltip>
        )}
        {inProgress && (
          <Button color="red.600" variant="outline" size="xs" onClick={cancel}>
            Cancel
          </Button>
        )}
        <Tooltip label="Refresh">
          <IconButton
            mt="-1"
            aria-label="Refresh"
            icon={<RepeatIcon />}
            variant="ghost"
            size="sm"
            isDisabled={!signature || inProgress}
            onClick={() => {
              start(signature);
            }}
          />
        </Tooltip>
      </Flex>

      <ErrorAlert
        error={results.error}
        onClose={() => {
          setResults({ ...results, error: "" });
        }}
      />

      <Signature signature={signature} slot={results.slot} fee={results.fee} />

      <Tabs colorScheme="main" variant="enclosed">
        <TabList>
          <Tab>Program Logs</Tab>
          <Tab>Account Balances</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ProgramLogs inProgress={inProgress} logs={results.logs} />
          </TabPanel>
          <TabPanel>
            <BalanceTable balances={results.balances || []} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Grid>
  );
};
