import { Box, Flex, FormLabel, Tag, Text } from "@chakra-ui/react";
import { TransactionConfirmationStatus } from "@solana/web3.js";
import React from "react";
import { useSessionStoreWithUndo } from "../../../hooks/useSessionStore";
import { toSol } from "../../../models/web3js-mappers";
import { CopyButton } from "../../common/CopyButton";
import { ExplorerButton } from "../../common/ExplorerButton";

export const Signature: React.FC<{
  signature: string;
  confirmations?: number;
  confirmationStatus?: TransactionConfirmationStatus;
  slot?: number;
  fee?: number;
}> = ({ signature, confirmations, confirmationStatus, slot, fee }) => {
  const rpcEndpoint = useSessionStoreWithUndo((state) => state.rpcEndpoint);

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
          fontFamily="mono"
          // minW="200px"
          borderWidth="1px"
          borderRadius="sm"
          wordBreak="break-all"
        >
          {signature || " "}
        </Text>
        <CopyButton size="xs" isDisabled={!signature} value={signature} />
        <ExplorerButton
          size="xs"
          valueType="tx"
          isDisabled={!signature}
          value={signature}
          rpcEndpoint={rpcEndpoint}
        />
      </Flex>

      <Flex mb="4" alignItems="center">
        <Box width="70px" />

        {confirmationStatus && (
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

        {slot && (
          <Tag mr="1">
            <strong>Slot:&nbsp;</strong> {slot}
          </Tag>
        )}
        {fee && (
          <Tag mr="1">
            <strong>Fee:&nbsp;</strong> {toSol(fee).toFixed()}{" "}
            {/* TODO with logo */}
          </Tag>
        )}
      </Flex>
    </>
  );
};
