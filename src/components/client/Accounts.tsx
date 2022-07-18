import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Heading,
  Icon,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useContext } from "react";
import { FaWallet } from "react-icons/fa";
import { v4 as uuid } from "uuid";
import { useTransactionStore } from "../../hooks/useTransactionStore";
import { instructionGetter } from "../../models/state";
import { IID } from "../../models/web3";
import { Sortable } from "../common/Sortable";
import { SortableItem } from "../common/SortableItem";
import { Account } from "./Account";
import { InstructionContext } from "./Instructions";

export const Accounts: React.FC = () => {
  const instructionId = useContext(InstructionContext);
  const getInstruction = instructionGetter(instructionId);
  const instruction = useTransactionStore(getInstruction);

  const set = useTransactionStore((state) => state.set);

  const { publicKey: walletPubkey } = useWallet();

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

  const addWalletAccount = () => {
    set((state) => {
      const instruction = getInstruction(state);
      const id = uuid();
      instruction.accounts[id] = {
        id,
        pubkey: walletPubkey?.toBase58() || "",
        isSigner: true,
        isWritable: false,
      };
      instruction.accountOrder.push(id);
    });
  };

  return (
    <>
      <Flex mb="3">
        <Heading mt="2" mb="3" mr="3" size="sm">
          Accounts
        </Heading>
        <Tooltip label="Add Account">
          <IconButton
            mr="2"
            aria-label="Add Account"
            icon={<AddIcon />}
            variant="outline"
            size="sm"
            onClick={addAccount}
          />
        </Tooltip>
        <Tooltip label="Add Wallet Account">
          <IconButton
            aria-label="Add Wallet Account"
            icon={<Icon as={FaWallet} />}
            variant="outline"
            size="sm"
            onClick={addWalletAccount}
          />
        </Tooltip>
      </Flex>
      <Box>
        <Sortable
          itemOrder={instruction.accountOrder}
          setItemOrder={setItemOrder}
        >
          {instruction.accountOrder.map((id, index) => (
            <SortableItem key={index}>
              <Account id={id} index={index} />
            </SortableItem>
          ))}
        </Sortable>
      </Box>
    </>
  );
};
