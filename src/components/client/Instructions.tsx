import { AddIcon } from "@chakra-ui/icons";
import { Grid, IconButton, Tooltip } from "@chakra-ui/react";
import React from "react";
import { useTransactionStore } from "../../hooks/useTransactionStore";
import { IID, newInstruction } from "../../models/web3";
import { Sortable } from "../common/Sortable";
import { SortableItem } from "../common/SortableItem";
import { Instruction } from "./Instruction";

export const InstructionContext = React.createContext("");

export const Instructions: React.FC = () => {
  const transaction = useTransactionStore((state) => state.transaction);
  const set = useTransactionStore((state) => state.set);
  const addInstruction = useTransactionStore((state) => state.addInstruction);

  const setOrderItem = (itemOrders: IID[]) => {
    set((state) => {
      state.transaction.instructionOrder = itemOrders;
    });
  };

  return (
    <Grid>
      <Sortable
        itemOrder={transaction.instructionOrder}
        setItemOrder={setOrderItem}
      >
        {transaction.instructionOrder.map((id) => (
          <InstructionContext.Provider value={id} key={id}>
            <SortableItem>
              <Instruction id={id} />
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
