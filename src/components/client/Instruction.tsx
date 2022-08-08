import {
  Collapse,
  Grid,
  Input,
  InputGroup,
  InputRightElement,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { useInstruction } from "../../hooks/useInstruction";
import { useSessionStoreWithUndo } from "../../hooks/useSessionStore";
import { ExplorerButton } from "../common/ExplorerButton";
import { Accounts } from "./accounts/Accounts";
import { Data } from "./data/Data";
import { InstructionHeader } from "./InstructionHeader";

export const Instruction: React.FC<{ index: number }> = ({ index }) => {
  const { instruction, update } = useInstruction();
  const rpcEndpoint = useSessionStoreWithUndo((state) => state.rpcEndpoint);

  return (
    <Grid
      mb="2"
      p="5"
      border="1px"
      rounded="md"
      borderColor={useColorModeValue("gray.200", "gray.600")}
      bg={
        instruction.disabled
          ? "repeating-linear-gradient(-45deg, transparent, transparent 40px, #85858510 40px, #85858510 80px)"
          : ""
      }
      bgColor={useColorModeValue("", "whiteAlpha.50")}
      boxShadow={useColorModeValue("base", "")}
    >
      <InstructionHeader index={index} />

      <Collapse in={instruction.expanded}>
        <InputGroup>
          <Input
            mb="5"
            fontFamily="mono"
            placeholder="Program ID"
            value={instruction.programId}
            onChange={(e) => {
              update((state) => {
                state.programId = e.target.value.trim();
              });
            }}
          />
          <InputRightElement
            // bug where it's set to 2 and goes in front of network selector menu :(
            zIndex="base"
          >
            <ExplorerButton
              size="sm"
              valueType="account"
              value={instruction.programId}
              rpcEndpoint={rpcEndpoint}
            />
          </InputRightElement>
        </InputGroup>

        <Accounts accounts={instruction.accounts} />

        <Data data={instruction.data} />
      </Collapse>
    </Grid>
  );
};
