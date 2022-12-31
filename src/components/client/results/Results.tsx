import {
  CheckCircleIcon,
  QuestionIcon,
  RepeatIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import {
  Button,
  Flex,
  forwardRef,
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
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { TransactionConfirmationStatus } from "@solana/web3.js";
import { BalanceTable } from "components/client/results/BalanceTable";
import { ProgramLogs } from "components/client/results/ProgramLogs";
import { Signature } from "components/client/results/Signature";
import { ErrorAlert } from "components/common/ErrorAlert";
import { useConfigStore } from "hooks/useConfigStore";
import { useGetWeb3Transaction } from "hooks/useGetWeb3Transaction";
import { useSessionStoreWithoutUndo } from "hooks/useSessionStore";
import {
  extractBalances,
  mapWeb3TransactionError,
} from "mappers/web3js-to-internal";
import { useEffect, useState } from "react";
import { IBalance } from "types/internal";
import { SIMULATED_SIGNATURE } from "utils/ui-constants";

type State = {
  slot?: number;
  confirmations?: number;
  confirmationStatus?: TransactionConfirmationStatus | "simulated";
  blockTime?: number;
  fee?: number;
  balances?: IBalance[];
  error?: string;
  logs?: string[];
  unitsConsumed?: number;
};

export const Results = forwardRef<{}, "div">((_, ref) => {
  const [results, setResults] = useState<State>({});
  const finality = useConfigStore((state) => state.transactionOptions.finality);

  const isSimulated = results.confirmationStatus === "simulated";

  const [simulationResults, error, set] = useSessionStoreWithoutUndo(
    (state) => [state.simulationResults, state.transactionRun.error, state.set]
  );

  const setInProgress = (value: boolean) =>
    set((state) => {
      state.transactionRun.inProgress = value;
    });

  const {
    signature,
    inProgress,
    endedAt,
    start: startWeb3Transaction,
    cancel: cancelWeb3Transaction,
  } = useGetWeb3Transaction({
    onStatus: ({ slot, confirmationStatus, confirmations, err }) => {
      setResults({
        ...results,
        slot,
        confirmationStatus,
        confirmations: confirmations || undefined,
        error: mapWeb3TransactionError(err),
      });
    },
    onSuccess: (response) => {
      setResults({
        confirmationStatus: "finalized",
        blockTime: response.blockTime || undefined,
        slot: response.slot,
        balances: extractBalances(response),
        logs: response.meta?.logMessages || [],
        error: mapWeb3TransactionError(response.meta?.err),
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

  const start = (signature: string, skipPolling: boolean = false) => {
    if (!signature) return;
    setResults({});
    startWeb3Transaction(signature, skipPolling);
  };

  // start confirming the tranaction when signature is set
  // by TransactionHeader component
  useEffect(() => {
    useSessionStoreWithoutUndo.subscribe(
      (state) => state.transactionRun.signature,
      (signature) => {
        if (signature === SIMULATED_SIGNATURE) {
          setResults({
            confirmationStatus: "simulated",
            confirmations: 0,
            slot: simulationResults?.slot,
            logs: simulationResults?.logs,
            balances: simulationResults?.balances,
            error,
            unitsConsumed: simulationResults?.unitsConsumed,
          });
        } else {
          start(signature);
        }
      }
    );
  });

  const cancel = () => {
    cancelWeb3Transaction();
    setInProgress(false);
  };

  return (
    <Grid ref={ref} pt="2" pl="5" pr="5">
      <Flex alignItems="center" mb="4">
        <Heading mr="3" size="md">
          Results
        </Heading>
        {results.confirmationStatus === finality ||
        results.confirmationStatus === "finalized" ||
        isSimulated ? (
          results.error ? (
            <>
              <WarningIcon mr="1" color="red.400" />
              <Text color="red.400" fontSize="sm">
                Fail{""}
                {isSimulated ? " (Simulated)" : ""}
              </Text>
            </>
          ) : (
            <>
              <CheckCircleIcon mr="1" color="green.400" />
              <Text color="green.400" fontSize="sm">
                Success{""}
                {isSimulated ? " (Simulated)" : ""}
              </Text>
            </>
          )
        ) : (
          signature &&
          !inProgress && (
            <>
              <QuestionIcon mr="1" color="yellow.400" />
              <Text color="yellow.400" fontSize="sm">
                Unknown
              </Text>
            </>
          )
        )}

        <Spacer />

        {endedAt && (
          <Tooltip
            label={`Last fetched @ ${new Date(endedAt).toLocaleString()}`}
          >
            <Tag height="20px" variant="outline">
              {new Date(endedAt).toLocaleTimeString()}
            </Tag>
          </Tooltip>
        )}
        {inProgress ? (
          <Button color="red.600" variant="outline" size="xs" onClick={cancel}>
            Cancel
          </Button>
        ) : (
          signature && (
            <Tooltip label="Refresh">
              <IconButton
                ml="1"
                aria-label="Refresh"
                icon={<RepeatIcon />}
                variant="ghost"
                size="sm"
                onClick={() => {
                  start(signature, true);
                }}
              />
            </Tooltip>
          )
        )}
      </Flex>

      <ErrorAlert
        error={error}
        onClose={() => {
          set((state) => {
            state.transactionRun.error = "";
          });
        }}
      />
      <ErrorAlert
        error={results.error}
        onClose={() => {
          setResults({ ...results, error: "" });
        }}
      />

      <Signature
        signature={isSimulated ? SIMULATED_SIGNATURE : signature}
        confirmationStatus={results.confirmationStatus}
        confirmations={results.confirmations}
        slot={results.slot}
        fee={results.fee}
        unitsConsumed={results.unitsConsumed}
      />

      <Tabs colorScheme="main" variant="enclosed">
        <TabList>
          <Tab fontSize="sm">Program Logs</Tab>
          <Tab fontSize="sm">Account Balances</Tab>
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
});
