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
import { Account } from "components/client/accounts/Account";
import { Sortable } from "components/common/Sortable";
import { useInstruction } from "hooks/useInstruction";
import React from "react";
import { IID } from "types/sortable";
import { newAccount } from "utils/internal";
import { addTo } from "utils/sortable";

export const AccountContext = React.createContext<{
  id: IID | number;
  isAnchor: boolean;
}>({ id: "", isAnchor: false });

export const Accounts: React.FC = () => {
  const { useShallowGet, update, isAnchor } = useInstruction();
  const [anchorAccountCount, accountOrder] = useShallowGet((state) => [
    state.anchorAccounts?.length || 0,
    state.accounts.order,
  ]);

  const emptyBgColour = useColorModeValue("blackAlpha.50", "whiteAlpha.50");

  return (
    <Grid>
      <Flex mt="2" mb="4" alignItems="center">
        <Heading mr="3" size="sm">
          Accounts
        </Heading>
        <Divider flex="1" />
      </Flex>

      {[...Array(anchorAccountCount).keys()]?.map((index) => (
        <AccountContext.Provider
          value={{ id: index, isAnchor: true }}
          key={index}
        >
          <Account index={index} />
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
          itemOrder={accountOrder}
          setItemOrder={(itemOrder) => {
            update((state) => {
              state.accounts.order = itemOrder;
            });
          }}
        >
          {accountOrder.map((id, index) => (
            <AccountContext.Provider value={{ id, isAnchor: false }} key={id}>
              <Account index={index + anchorAccountCount} />
            </AccountContext.Provider>
          ))}
        </Sortable>
      </Box>

      {accountOrder.length + anchorAccountCount === 0 && (
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
