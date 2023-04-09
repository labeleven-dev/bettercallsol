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
  Text,
  Tooltip,
  forwardRef,
} from "@chakra-ui/react";
import { BalanceTable } from "components/client/results/BalanceTable";
import { ProgramLogs } from "components/client/results/ProgramLogs";
import { Signature } from "components/client/results/Signature";
import { ErrorAlert } from "components/common/ErrorAlert";
import { RelativeTimestamp } from "components/common/RelativeTimestamp";
import { useConfigStore } from "hooks/useConfigStore";
import { useShallowSessionStoreWithoutUndo } from "hooks/useSessionStore";
import { IPubKey } from "types/internal";
import { SIMULATED_SIGNATURE } from "utils/ui-constants";

export const Results = forwardRef<
  {
    startGet: (signature: IPubKey, skipPolling?: boolean) => void;
    cancelGet: () => void;
    endedAt?: number;
  },
  "div"
>(({ startGet, cancelGet, endedAt }, ref) => {
  const finality = useConfigStore((state) => state.transactionOptions.finality);

  const [transactionRun, set] = useShallowSessionStoreWithoutUndo((state) => [
    state.transactionRun,
    state.set,
  ]);

  const isSimulated = transactionRun.signature === SIMULATED_SIGNATURE;

  return (
    <Grid ref={ref} pt="2" pl="5" pr="5">
      <Flex alignItems="center" mb="4">
        <Heading mr="3" size="md">
          Results
        </Heading>
        {transactionRun.confirmationStatus === finality ||
        transactionRun.confirmationStatus === "finalized" ||
        isSimulated ? (
          transactionRun.error ? (
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
          transactionRun.signature &&
          !transactionRun.inProgress && (
            <>
              <QuestionIcon mr="1" color="yellow.400" />
              <Text color="yellow.400" fontSize="sm">
                Unknown
              </Text>
            </>
          )
        )}

        <Spacer />

        {
          // do not display if transaction has been cleared, i.e. no signature
          endedAt && transactionRun.signature && (
            <Tooltip label={new Date(endedAt).toLocaleString()}>
              <Text fontSize="sm" color="gray.400">
                Last fetched <RelativeTimestamp timestamp={endedAt} />
              </Text>
            </Tooltip>
          )
        }
        {transactionRun.inProgress ? (
          <Button
            color="red.600"
            variant="outline"
            size="xs"
            onClick={cancelGet}
          >
            Cancel
          </Button>
        ) : (
          transactionRun.signature && (
            <Tooltip label="Refresh">
              <IconButton
                ml="1"
                aria-label="Refresh"
                icon={<RepeatIcon />}
                variant="ghost"
                size="sm"
                onClick={() => {
                  startGet(transactionRun.signature, true);
                }}
              />
            </Tooltip>
          )
        )}
      </Flex>

      <ErrorAlert
        error={transactionRun.error}
        onClose={() => {
          set((state) => {
            state.transactionRun.error = "";
          });
        }}
      />

      <Signature
        signature={transactionRun.signature}
        confirmationStatus={transactionRun.confirmationStatus}
        confirmations={transactionRun.confirmations}
        slot={transactionRun.slot}
        fee={transactionRun.fee}
        unitsConsumed={transactionRun.unitsConsumed}
      />

      <Tabs colorScheme="main" variant="enclosed">
        <TabList>
          <Tab fontSize="sm">Program Logs</Tab>
          <Tab fontSize="sm">Account Balances</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ProgramLogs
              inProgress={transactionRun.inProgress}
              logs={transactionRun.logs}
            />
          </TabPanel>
          <TabPanel>
            <BalanceTable balances={transactionRun.balances || []} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Grid>
  );
});
