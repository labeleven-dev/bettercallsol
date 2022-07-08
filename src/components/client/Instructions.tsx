import { AddIcon } from "@chakra-ui/icons";
import { Grid, IconButton, Tooltip } from "@chakra-ui/react";
import React from "react";
import { v4 as uuid } from "uuid";
import { useTransactionStore } from "../../store";
import { IID } from "../../web3";
import { Sortable } from "../common/Sortable";
import { Instruction } from "./Instruction";

export const InstructionContext = React.createContext("");

export const Instructions: React.FC = () => {
  const transaction = useTransactionStore((state) => state.transaction);
  const set = useTransactionStore((state) => state.set);

  const setOrderItem = (itemOrders: IID[]) => {
    set((state) => {
      state.transaction.instructionOrder = itemOrders;
    });
  };

  const addInstruction = () => {
    set((state) => {
      const id = uuid();
      state.transaction.instructions[id] = {
        id,
        name: `Instruction #${state.transaction.instructionOrder.length}`,
        programId: "",
        data: "",
        accounts: {},
        accountOrder: [],
      };
      state.transaction.instructionOrder.push(id);
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
            <Instruction />
          </InstructionContext.Provider>
        ))}
      </Sortable>
      <Tooltip label="Add Instruction">
        <IconButton
          aria-label="Add Instruction"
          icon={<AddIcon />}
          variant="ghost"
          onClick={addInstruction}
        />
      </Tooltip>
    </Grid>
  );
};
