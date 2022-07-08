import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { useTransactionStore } from "../../store";
import { DEFAULT_NETWORKS } from "../../web3";

export const NetworkSelector: React.FC = () => {
  const network = useTransactionStore(
    (state) => state.transactionOptions.network
  );
  const set = useTransactionStore((state) => state.set);

  const networkColours = new Map<string, string>([
    ["Devnet", useColorModeValue("green.700", "green.400")],
    ["Testnet", useColorModeValue("blue.700", "blue.400")],
    ["Mainnet-beta", useColorModeValue("red.700", "red.400")],
  ]);

  return (
    <Menu>
      <MenuButton
        w="150px"
        color={networkColours.get(network.name)}
        as={Button}
        rightIcon={<ChevronDownIcon />}
      >
        {network.name}
      </MenuButton>
      <MenuList>
        {DEFAULT_NETWORKS.map(({ id, name, url }) => (
          <MenuItem
            color={networkColours.get(name)}
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
