import {
  Collapse,
  Grid,
  Input,
  InputGroup,
  InputRightElement,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { useOptionsStore } from "../../hooks/useOptionsStore";
import { useTransactionStore } from "../../hooks/useTransactionStore";
import { instructionGetter } from "../../models/state";
import { ExplorerButton } from "../common/ExplorerButton";
import { SortableItemContext } from "../common/Sortable";
import { Accounts } from "./Accounts";
import { Data } from "./Data";
import { InstructionHeader } from "./InstructionHeader";
import { InstructionContext } from "./Instructions";

export const Instruction: React.FC = () => {
  const instruction = useContext(InstructionContext);
  const { listeners, attributes } = useContext(SortableItemContext);
  const network = useOptionsStore(
    (state) => state.transactionOptions.rpcEndpoint.network
  );
  const uiState = useTransactionStore(
    (state) => state.uiState.instructions[instruction.id]
  );
  const set = useTransactionStore((state) => state.set);

  const getInstruction = instructionGetter(instruction.id);

  return (
    <Grid
      mb="2"
      p="5"
      border="1px"
      rounded="md"
      borderColor={useColorModeValue("gray.200", "gray.600")}
      bg={
        uiState.disabled
          ? "repeating-linear-gradient(-45deg, transparent, transparent 40px, #85858510 40px, #85858510 80px)"
          : ""
      }
      bgColor={useColorModeValue("", "whiteAlpha.50")}
      boxShadow={useColorModeValue("base", "")}
    >
      <InstructionHeader attributes={attributes!} listeners={listeners!} />

      <Collapse in={uiState.expanded}>
        <InputGroup>
          <Input
            mb="5"
            fontFamily="mono"
            placeholder="Program ID"
            value={instruction.programId}
            onChange={(e) => {
              set((state) => {
                getInstruction(state).programId = e.target.value;
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
              network={network}
            />
          </InputRightElement>
        </InputGroup>

        <Accounts />
        <Data />
      </Collapse>
    </Grid>
  );
};
