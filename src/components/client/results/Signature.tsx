import { RepeatIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Tag,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import { usePersistentStore } from "../../../hooks/usePersistentStore";
import { toSol } from "../../../models/web3js-mappers";
import { CopyButton } from "../../common/CopyButton";
import { ExplorerButton } from "../../common/ExplorerButton";

export const Signature: React.FC<{
  signature: string;
  inProgress: boolean;
  refresh: (signature: string) => void;
  slot?: number;
  fee?: number;
}> = ({ signature, inProgress, refresh, slot, fee }) => {
  const rpcEndpoint = usePersistentStore(
    (state) => state.transactionOptions.rpcEndpoint
  );

  return (
    <>
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
            fontFamily="mono"
            placeholder="Transaction Signature"
            isReadOnly
            value={signature}
          />
          <InputRightElement w="60px">
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

        <Tooltip label="Refresh">
          <IconButton
            aria-label="Refresh"
            icon={<RepeatIcon />}
            variant="ghost"
            size="sm"
            isDisabled={!signature || inProgress}
            onClick={() => {
              refresh(signature);
            }}
          />
        </Tooltip>
      </Flex>

      <Flex mb="4">
        <Box width="70px" />
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
