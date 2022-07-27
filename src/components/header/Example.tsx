import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import React from "react";

export const Example: React.FC = () => {
  const { publicKey: walletPublicKey } = useWallet();

  return (
    <Menu>
      <Tooltip
        shouldWrapChildren
        hasArrow={!walletPublicKey}
        label={
          walletPublicKey
            ? "Run Program"
            : "Please connect a wallet to contiune"
        }
      >
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          variant="ghost"
          textColor="white"
          isDisabled={!walletPublicKey}
        >
          Examples
        </MenuButton>
      </Tooltip>

      <MenuList fontSize="md">
        <MenuItem>System Program: Transfer SOL</MenuItem>
        <MenuItem>System Program: Create Account</MenuItem>
        {/* TODO more examples */}
      </MenuList>
    </Menu>
  );
};
