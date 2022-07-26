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
import React from "react";
import { FaWallet } from "react-icons/fa";
import { useInstruction } from "../../hooks/useInstruction";
import { addTo, toSortedArray } from "../../models/sortable";
import { newAccount } from "../../models/web3";
import { Sortable } from "../common/Sortable";
import { Account } from "./Account";

export const Accounts: React.FC = () => {
  const { instruction, update } = useInstruction();
  const { publicKey: walletPubkey } = useWallet();

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
            onClick={() => {
              update((state) => {
                addTo(state.accounts, newAccount());
              });
            }}
          />
        </Tooltip>
        <Tooltip label="Add Wallet Account">
          <IconButton
            aria-label="Add Wallet Account"
            icon={<Icon as={FaWallet} />}
            variant="outline"
            size="sm"
            onClick={() => {
              update((state) => {
                addTo(state.accounts, {
                  ...newAccount(),
                  pubkey: walletPubkey?.toBase58() || "",
                  isSigner: true,
                });
              });
            }}
          />
        </Tooltip>
      </Flex>
      <Box>
        <Sortable
          itemOrder={instruction.accounts.order}
          setItemOrder={(itemOrder) => {
            update((state) => {
              state.accounts.order = itemOrder;
            });
          }}
        >
          {toSortedArray(instruction.accounts).map((account, index) => (
            <Account data={account} index={index} key={account.id} />
          ))}
        </Sortable>
      </Box>
    </>
  );
};
