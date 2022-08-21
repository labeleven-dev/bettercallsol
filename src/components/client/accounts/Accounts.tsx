import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Divider,
  Flex,
  Grid,
  Heading,
  IconButton,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { useInstruction } from "../../../hooks/useInstruction";
import { IAccount } from "../../../types/internal";
import { SortableCollection } from "../../../types/sortable";
import { newAccount } from "../../../utils/internal";
import { addTo, toSortedArray } from "../../../utils/sortable";
import { Sortable } from "../../common/Sortable";
import { Account } from "./Account";

export const AccountContext = React.createContext(newAccount());

export const Accounts: React.FC<{
  accounts: SortableCollection<IAccount>;
  anchorAccounts?: IAccount[];
}> = ({ accounts, anchorAccounts }) => {
  const { update, isAnchor } = useInstruction();

  const emptyBgColour = useColorModeValue("blackAlpha.50", "whiteAlpha.50");

  return (
    <Grid>
      <Flex mt="2" mb="4" alignItems="center">
        <Heading mr="3" size="sm">
          Accounts
        </Heading>
        <Divider flex="1" />
      </Flex>

      {anchorAccounts?.map((account, index) => (
        <AccountContext.Provider value={account} key={account.id}>
          <Account account={account} isAnchor={true} index={index} />
        </AccountContext.Provider>
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
            <AccountContext.Provider value={account} key={account.id}>
              <Account
                account={account}
                index={index + (anchorAccounts?.length || 0)}
              />
            </AccountContext.Provider>
          ))}
        </Sortable>
      </Box>

      {accounts.order.length + (anchorAccounts?.length || 0) === 0 && (
        <Center p="6" m="1" bgColor={emptyBgColour} rounded="md">
          <Text as="i" fontSize="sm" textColor="grey">
            No accounts yet. Click on <AddIcon ml="0.5" mr="0.5" w="2.5" />{" "}
            below to add one.
          </Text>
        </Center>
      )}

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
