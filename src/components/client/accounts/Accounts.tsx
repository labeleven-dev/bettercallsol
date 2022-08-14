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
import { IAccount } from "../../../types/internal";
import { SortableCollection } from "../../../types/sortable";
import { newAccount } from "../../../utils/internal";
import { addTo, toSortedArray } from "../../../utils/sortable";
import { Sortable } from "../../common/Sortable";
import { Account } from "./Account";

export const Accounts: React.FC<{
  accounts: SortableCollection<IAccount>;
  anchorAccounts?: IAccount[];
}> = ({ accounts, anchorAccounts }) => {
  const { update, isAnchor } = useInstruction();

  return (
    <Grid>
      <Flex mt="2" mb="4" alignItems="center">
        <Heading mr="3" size="sm">
          Accounts
        </Heading>
        <Divider flex="1" />
      </Flex>

      {anchorAccounts?.map((account, index) => (
        <Account
          account={account}
          locked={true}
          index={index}
          key={account.id}
        />
      ))}

      {isAnchor && (
        <Flex mt="4" mb="3" alignItems="center">
          <Divider flex="1" />
          <Heading mr="3" ml="3" size="xs">
            Remaining Accounts
          </Heading>
          <Divider flex="1" />
        </Flex>
      )}

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
            <Account
              account={account}
              index={index + (anchorAccounts?.length || 0)}
              key={account.id}
            />
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
