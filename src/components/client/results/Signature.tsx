import { Box, Flex, FormLabel, Tag, Text, Wrap } from "@chakra-ui/react";
import { CopyButton } from "components/common/CopyButton";
import { ExplorerButton } from "components/common/ExplorerButton";
import {
  useSessionStoreWithUndo,
  useSessionStoreWithoutUndo,
} from "hooks/useSessionStore";
import React from "react";
import { SIMULATED_SIGNATURE } from "utils/ui-constants";
import { short, toSol } from "utils/web3js";

export const Signature: React.FC = () => {
  const rpcEndpoint = useSessionStoreWithUndo((state) => state.rpcEndpoint);
  const [
    signature,
    recentBlockhash,
    lastValidBlockHeight,
    confirmations,
    confirmationStatus,
    slot,
    fee,
    unitsConsumed,
  ] = useSessionStoreWithoutUndo((state) => [
    state.transactionRun.signature,
    state.transactionRun.recentBlockhash,
    state.transactionRun.lastValidBlockHeight,
    state.transactionRun.confirmations,
    state.transactionRun.confirmationStatus,
    state.transactionRun.slot,
    state.transactionRun.fee,
    state.transactionRun.unitsConsumed,
  ]);

  return (
    <>
      <Flex alignItems="center" mb="1">
        <FormLabel pt="2" htmlFor="signature" textAlign="right" fontSize="sm">
          Signature
        </FormLabel>

        <Text
          p="5px 10px 5px 10px"
          id="signature"
          mr="1"
          fontSize="sm"
          minW="300px"
          minH="30px"
          fontFamily="mono"
          borderWidth="1px"
          borderRadius="sm"
          wordBreak="break-all"
        >
          {signature || " "}
        </Text>
        <CopyButton size="xs" isDisabled={!signature} value={signature} />
        <ExplorerButton
          size="xs"
          variant="button"
          valueType="tx"
          isDisabled={!signature || signature === SIMULATED_SIGNATURE}
          value={signature}
          rpcEndpoint={rpcEndpoint}
        />
      </Flex>

      <Flex mb="4" alignItems="center">
        <Box width="90px" />
        <Wrap>
          {confirmationStatus && confirmationStatus !== "simulated" && (
            <Tag
              mr="1"
              colorScheme={
                confirmationStatus === "confirmed" ||
                confirmationStatus === "finalized"
                  ? "green"
                  : confirmationStatus === "processed"
                  ? "yellow"
                  : "blue"
              }
            >
              {confirmationStatus === "processed"
                ? "Processed"
                : confirmationStatus === "confirmed"
                ? `Confirmed by ${confirmations || 0}`
                : confirmationStatus === "finalized"
                ? `Finalised by max confirmations`
                : ""}
            </Tag>
          )}

          {recentBlockhash && (
            <Tag mr="1">
              <strong>Recent blockhash:&nbsp;</strong> {short(recentBlockhash)}
              <CopyButton ml="1" size="xs" value={recentBlockhash} />
            </Tag>
          )}

          {lastValidBlockHeight !== undefined && (
            <Tag mr="1">
              <strong>Last valid block height:&nbsp;</strong>{" "}
              {lastValidBlockHeight}
            </Tag>
          )}

          {slot && (
            <Tag mr="1">
              <strong>Slot:&nbsp;</strong> {slot}
            </Tag>
          )}
          {fee != undefined && (
            <Tag mr="1">
              <strong>Fee:&nbsp;</strong> {toSol(fee).toFixed()}{" "}
              {/* TODO with logo */}
            </Tag>
          )}
          {unitsConsumed != undefined && (
            <Tag mr="1">
              <strong>Units Consumed:&nbsp;</strong> {unitsConsumed}{" "}
            </Tag>
          )}
        </Wrap>
      </Flex>
    </>
  );
};
