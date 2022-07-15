import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import { useTransactionStore } from "../../hooks/useTransactionStore";
import { DEFAULT_NETWORKS } from "../../models/web3";

export const NetworkSelector: React.FC = () => {
  const network = useTransactionStore(
    (state) => state.transactionOptions.network
  );
  const disableMainnet = useTransactionStore(
    (state) => state.appOptions.disableMainnet
  );

  const set = useTransactionStore((state) => state.set);

  return (
    <Menu>
      <MenuButton w="150px" as={Button} rightIcon={<ChevronDownIcon />}>
        {network.name}
      </MenuButton>
      <MenuList>
        {DEFAULT_NETWORKS.filter(
          ({ id }) => !disableMainnet || id !== "mainnet-beta"
        ).map(({ id, name, url }) => (
          <MenuItem
            onClick={() =>
              set((state) => {
                state.transactionOptions.network = { id, name, url };
              })
            }
            key={id}
          >
            {name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
