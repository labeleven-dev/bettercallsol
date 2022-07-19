import { AddIcon } from "@chakra-ui/icons";
import { Grid, IconButton, Tooltip } from "@chakra-ui/react";
import React from "react";
import { useTransactionStore } from "../../hooks/useTransactionStore";
import { IID, toOrderedArray } from "../../models/sortable";
import { newInstruction } from "../../models/web3";
import { Sortable } from "../common/Sortable";
import { SortableItem } from "../common/SortableItem";
import { Instruction } from "./Instruction";

export const InstructionContext = React.createContext(newInstruction());

export const Instructions: React.FC = () => {
  const transaction = useTransactionStore((state) => state.transaction);
  const set = useTransactionStore((state) => state.set);
  const addInstruction = useTransactionStore((state) => state.addInstruction);

  const setOrderItem = (itemOrders: IID[]) => {
    set((state) => {
      state.transaction.instructions.order = itemOrders;
    });
  };

  return (
    <Grid>
      <Sortable
        itemOrder={transaction.instructions.order}
        setItemOrder={setOrderItem}
      >
        {toOrderedArray(transaction.instructions).map((instruction) => (
          // key must be stable so it can't be loop index
          <InstructionContext.Provider value={instruction} key={instruction.id}>
            <SortableItem>
              <Instruction />
            </SortableItem>
          </InstructionContext.Provider>
        ))}
      </Sortable>
      <Tooltip label="Add Instruction">
        <IconButton
          aria-label="Add Instruction"
          icon={<AddIcon />}
          variant="ghost"
          onClick={() => {
            addInstruction(newInstruction());
          }}
        />
      </Tooltip>
    </Grid>
  );
};
