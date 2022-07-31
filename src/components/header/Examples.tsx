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
import { useSessionStore } from "../../hooks/useSessionStore";
import { EXAMPLES } from "../../models/examples";
import { mapFromTransactionExt } from "../../models/external-mappers";
import { DEFAULT_RESULTS } from "../../models/state-default";

export const Example: React.FC = () => {
  const { publicKey: walletPublicKey } = useWallet();
  const set = useSessionStore((state) => state.set);

  const loadExample = (name: string) => {
    set((state) => {
      state.transaction = mapFromTransactionExt(
        EXAMPLES[name](walletPublicKey?.toBase58()!)
      );
      state.results = DEFAULT_RESULTS;
    });
  };

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
        <MenuItem
          onClick={() => {
            loadExample("systemProgramTransfer");
          }}
        >
          System Program: Transfer SOL
        </MenuItem>
        <MenuItem
          onClick={() => {
            loadExample("systemProgramCreateAccount");
          }}
        >
          System Program: Create Account
        </MenuItem>

        {/* TODO more examples */}
      </MenuList>
    </Menu>
  );
};
