import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Divider,
  Flex,
  Grid,
  Heading,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import { useInstruction } from "../../../hooks/useInstruction";
import { newAccount } from "../../../models/internal-mappers";
import { IAccount } from "../../../models/internal-types";
import {
  addTo,
  SortableCollection,
  toSortedArray,
} from "../../../models/sortable";
import { Sortable } from "../../common/Sortable";
import { Account } from "./Account";

export const Accounts: React.FC<{ accounts: SortableCollection<IAccount> }> = ({
  accounts,
}) => {
  const { update } = useInstruction();

  return (
    <Grid>
      <Flex mb="3">
        <Heading mt="2" mb="3" mr="3" size="sm">
          Accounts
        </Heading>
        <Divider flex="1" ml="3" mt="3.5" />
      </Flex>
      <Box>
        <Sortable
          itemOrder={accounts.order}
          setItemOrder={(itemOrder) => {
            update((state) => {
              state.accounts.order = itemOrder;
            });
          }}
        >
          {toSortedArray(accounts).map((account, index) => (
            <Account data={account} index={index} key={account.id} />
          ))}
        </Sortable>
      </Box>
      <Tooltip label="Add Account">
        <IconButton
          mt="1"
          aria-label="Add Account"
          icon={<AddIcon />}
          variant="ghost"
          size="sm"
          onClick={() => {
            update((state) => {
              addTo(state.accounts, newAccount());
            });
          }}
        />
      </Tooltip>
    </Grid>
  );
};