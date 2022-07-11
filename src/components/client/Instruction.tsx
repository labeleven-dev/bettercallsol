import { Collapse, Grid, Input, useColorModeValue } from "@chakra-ui/react";
import { defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { useContext } from "react";
import { useTransactionStore } from "../../hooks/useTransactionStore";
import { instructionGetter } from "../../state";
import { Accounts } from "./Accounts";
import { Data } from "./Data";
import { InstructionHeader } from "./InstructionHeader";
import { InstructionContext } from "./Instructions";

export const Instruction: React.FC = () => {
  const instructionId = useContext(InstructionContext);
  const getInstruction = instructionGetter(instructionId);
  const instruction = useTransactionStore(
    (state) => state.transaction.instructions[instructionId]
  );

  const set = useTransactionStore((state) => state.set);

  // TODO find a clean way to abstract this away into their own SortableItem
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: instructionId,
      animateLayoutChanges: (args) =>
        defaultAnimateLayoutChanges({ ...args, wasDragging: true }),
    });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

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
        instruction.disabled
          ? "repeating-linear-gradient(-45deg, transparent, transparent 40px, #85858510 40px, #85858510 80px)"
          : ""
      }
      bgColor={useColorModeValue("", "whiteAlpha.50")}
      boxShadow={useColorModeValue("base", "")}
    >
      <InstructionHeader attributes={attributes} listeners={listeners!} />

      <Collapse in={instruction.expanded}>
        <Input
          mb="5"
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
