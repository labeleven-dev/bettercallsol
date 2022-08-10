import {
  Box,
  Flex,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Tag,
} from "@chakra-ui/react";
import { TransactionConfirmationStatus } from "@solana/web3.js";
import React from "react";
import { usePersistentStore } from "../../../hooks/usePersistentStore";
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
  const finality = usePersistentStore(
    (state) => state.transactionOptions.finality
  );

  return (
    <>
      <Flex alignItems="center" mb="1">
        <FormLabel pt="2" htmlFor="signature" textAlign="right" fontSize="sm">
          Signature
        </FormLabel>

        <InputGroup flex="1" mr="1" size="sm">
          <Input
            id="signature"
            fontFamily="mono"
            placeholder="Transaction Signature"
            isReadOnly
            paddingEnd="55px"
            value={signature}
          />
          <InputRightElement
            // chakra hardcode the width so we can't have multiple buttons
            w=""
            mr="1"
          >
            <CopyButton size="xs" isDisabled={!signature} value={signature} />
            <ExplorerButton
              size="xs"
              valueType="tx"
              isDisabled={!signature}
              value={signature}
              rpcEndpoint={rpcEndpoint}
            />
          </InputRightElement>
        </InputGroup>
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
            height="20px"
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
