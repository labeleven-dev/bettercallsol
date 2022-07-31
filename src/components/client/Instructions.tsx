import { AddIcon } from "@chakra-ui/icons";
import { Grid, IconButton, Tooltip } from "@chakra-ui/react";
import React from "react";
import { useSessionStore } from "../../hooks/useSessionStore";
import { newInstruction } from "../../models/internal-mappers";
import { IInstruction } from "../../models/internal-types";
import {
  addTo,
  IID,
  SortableCollection,
  toSortedArray,
} from "../../models/sortable";
import { Sortable } from "../common/Sortable";
import { Instruction } from "./Instruction";

export const InstructionContext = React.createContext(newInstruction());

export const Instructions: React.FC<{
  instructions: SortableCollection<IInstruction>;
}> = ({ instructions }) => {
  const set = useSessionStore((state) => state.set);

  const setOrderItem = (itemOrders: IID[]) => {
    set((state) => {
      state.transaction.instructions.order = itemOrders;
    });
  };

  return (
    <Grid>
      <Sortable itemOrder={instructions.order} setItemOrder={setOrderItem}>
        {toSortedArray(instructions).map((instruction, index) => (
          // key must be stable so it can't be loop index
          <InstructionContext.Provider value={instruction} key={instruction.id}>
            <Instruction index={index} />
          </InstructionContext.Provider>
        ))}
      </Sortable>
      <Tooltip label="Add Instruction">
        <IconButton
          aria-label="Add Instruction"
          icon={<AddIcon />}
          variant="ghost"
          onClick={() => {
            set((state) => {
              addTo(state.transaction.instructions, newInstruction());
            });
          }}
        />
      </Tooltip>
    </Grid>
  );
};
