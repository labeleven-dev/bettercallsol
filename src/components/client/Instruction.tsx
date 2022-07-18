import { Collapse, Grid, Input, useColorModeValue } from "@chakra-ui/react";
import React, { useContext } from "react";
import { useTransactionStore } from "../../hooks/useTransactionStore";
import { instructionGetter } from "../../models/state";
import { SortableItemProps } from "../common/SortableItem";
import { Accounts } from "./Accounts";
import { Data } from "./Data";
import { InstructionHeader } from "./InstructionHeader";
import { InstructionContext } from "./Instructions";

export const Instruction: React.FC<SortableItemProps> = ({
  attributes,
  listeners,
  setNodeRef,
  style,
}) => {
  const instructionId = useContext(InstructionContext);
  const getInstruction = instructionGetter(instructionId);

  const instruction = useTransactionStore(
    (state) => state.transaction.instructions[instructionId]
  );
  const uiState = useTransactionStore(
    (state) => state.uiState.instructions[instructionId]
  );
  const set = useTransactionStore((state) => state.set);

  return (
    <Grid
      ref={setNodeRef}
      style={style}
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
        <Accounts />
        <Data />
      </Collapse>
    </Grid>
  );
};
