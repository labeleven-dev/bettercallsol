import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  CloseButton,
  Flex,
  FormLabel,
  Grid,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import { useTransactionStore } from "../../hooks/useTransactionStore";
import { toSol } from "../../web3";
import { CopyButton } from "../common/CopyButton";
import { ExplorerButton } from "../common/ExplorerButton";
import { BalanceTable } from "./BalanceTable";
import { ProgramLogs } from "./ProgramLogs";

export const Results: React.FC = () => {
  const results = useTransactionStore((state) => state.results);
  const set = useTransactionStore((state) => state.set);

  return (
    <Grid p="5">
      <Flex>
        <Heading mb="6" mr="3" size="md">
          Results
        </Heading>
        {results.confirmationStatus === "finalized" &&
          (results.error ? (
            <Tooltip label="Transaction returned a failure">
              <WarningIcon mt="0.5" color="red.400" />
            </Tooltip>
          ) : (
            <Tooltip label="Transaction returned a success">
              <CheckCircleIcon mt="1" mr="1" color="green.400" />
            </Tooltip>
          ))}
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
              ? `Confirmed by ${results.confirmations}`
              : `Finalised by max confirmations`}
          </Tag>
        )}
      </Flex>
      {results.error && (
        <Alert
          mb="5"
          status="error"
          fontSize="md"
          rounded="sm"
          variant="left-accent"
        >
          <AlertIcon />
          <AlertDescription flex="1">{results.error}</AlertDescription>
          <CloseButton
            alignSelf="flex-start"
            position="relative"
            right={-1}
            top={-1}
            onClick={() => {
              set((state) => {
                state.results.error = "";
              });
            }}
          />
        </Alert>
      )}
      <Flex>
        <FormLabel
          pt="2"
          mb="3"
          htmlFor="signature"
          textAlign="right"
          fontSize="sm"
        >
          Signature
        </FormLabel>
        <InputGroup flex="1" mr="1" size="sm">
          <Input
            id="signature"
            placeholder="Transaction Signature"
            isReadOnly
            value={results.signature}
          />
          <InputRightElement>
            <ExplorerButton
              valueType="tx"
              isDisabled={!results.signature}
              value={results.signature}
            />
          </InputRightElement>
        </InputGroup>
        <CopyButton isDisabled={!results.signature} value={results.signature} />
      </Flex>
      <Flex mb="4">
        <Box width="70px" />
        {results.slot && (
          <Tag mr="1">
            <strong>Slot:&nbsp;</strong> {results.slot}
          </Tag>
        )}
        {results.fee && (
          <Tag mr="1">
            <strong>Fee:&nbsp;</strong> {toSol(results.fee)}{" "}
            {/* TODO with logo */}
          </Tag>
        )}
      </Flex>

      <Tabs colorScheme="main" variant="enclosed">
        <TabList>
          <Tab>Program Logs</Tab>
          <Tab>Account Balances</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ProgramLogs />
          </TabPanel>
          <TabPanel>
            <BalanceTable balances={results.balances || []} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Grid>
  );
};
