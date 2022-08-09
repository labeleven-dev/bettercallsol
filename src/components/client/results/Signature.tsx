import {
  Box,
  Flex,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Tag,
} from "@chakra-ui/react";
import React from "react";
import { useSessionStoreWithUndo } from "../../../hooks/useSessionStore";
import { toSol } from "../../../models/web3js-mappers";
import { CopyButton } from "../../common/CopyButton";
import { ExplorerButton } from "../../common/ExplorerButton";

export const Signature: React.FC<{
  signature: string;
  slot?: number;
  fee?: number;
}> = ({ signature, slot, fee }) => {
  const rpcEndpoint = useSessionStoreWithUndo((state) => state.rpcEndpoint);

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
            value={signature}
          />
          <InputRightElement
            // chakra hardcode the width so we can't have multiple buttons
            w=""
            mr="1"
            // bug where it's set to 2 and goes in front of network selector menu :(
            // downside is that it is not clickable when the text field is active
            zIndex="base"
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
