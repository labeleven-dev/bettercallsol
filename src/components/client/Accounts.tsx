import { AddIcon } from "@chakra-ui/icons";
import { Box, Heading, IconButton, Tooltip } from "@chakra-ui/react";
import React, { useContext } from "react";
import { v4 as uuid } from "uuid";
import { instructionGetter, useTransactionStore } from "../../store";
import { IID } from "../../web3";
import { Sortable } from "../common/Sortable";
import { Account } from "./Account";
import { InstructionContext } from "./Instructions";

export const Accounts: React.FC = () => {
  const instructionId = useContext(InstructionContext);
  const getInstruction = instructionGetter(instructionId);
  const instruction = useTransactionStore(getInstruction);

  const set = useTransactionStore((state) => state.set);

  const setItemOrder = (itemOrder: IID[]) => {
    set((state) => {
      getInstruction(state).accountOrder = itemOrder;
    });
  };

  const addAccount = () => {
    set((state) => {
      const instruction = getInstruction(state);
      const id = uuid();
      instruction.accounts[id] = {
        id,
        pubkey: "",
        isSigner: false,
        isWritable: false,
      };
      instruction.accountOrder.push(id);
    });
  };

  return (
    <>
      <Heading mb="3" size="sm">
        Accounts
      </Heading>
      <Box>
        <Sortable
          itemOrder={instruction.accountOrder}
          setItemOrder={setItemOrder}
        >
          {instruction.accountOrder.map((id) => (
            <Account accountId={id} key={id} />
          ))}
        </Sortable>
      </Box>
      <Tooltip label="Add Account">
        <IconButton
          aria-label="Add Account"
          icon={<AddIcon />}
          variant="ghost"
          onClick={addAccount}
        />
      </Tooltip>
    </>
  );
};
