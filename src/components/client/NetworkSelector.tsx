import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import { useTransactionStore } from "../../hooks/useTransactionStore";
import { DEFAULT_NETWORKS } from "../../web3";

export const NetworkSelector: React.FC = () => {
  const network = useTransactionStore(
    (state) => state.transactionOptions.network
  );
  const set = useTransactionStore((state) => state.set);

  return (
    <Menu>
      <MenuButton w="150px" as={Button} rightIcon={<ChevronDownIcon />}>
        {network.name}
      </MenuButton>
      <MenuList>
        {DEFAULT_NETWORKS.map(({ id, name, url }) => (
          <MenuItem
            onClick={() =>
              set((state) => {
                state.transactionOptions.network = { id, name, url };
              })
            }
            key={name}
          >
            {name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
