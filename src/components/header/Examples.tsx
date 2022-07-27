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
import { useTransactionStore } from "../../hooks/useTransactionStore";
import { EXAMPLES } from "../../models/examples";
import { mapFromTransactionExt } from "../../models/external-mappers";

export const Example: React.FC = () => {
  const { publicKey: walletPublicKey } = useWallet();
  const setTransaction = useTransactionStore((state) => state.setTransaction);

  const loadExample = (name: string) => {
    setTransaction(
      mapFromTransactionExt(EXAMPLES[name](walletPublicKey?.toBase58()!))
    );
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
            loadExample("systemProgramCreateAccount");
          }}
        >
          System Program: Create Account
        </MenuItem>
        <MenuItem
          onClick={() => {
            loadExample("systemProgramTransfer");
          }}
        >
          System Program: Transfer SOL
        </MenuItem>

        {/* TODO more examples */}
      </MenuList>
    </Menu>
  );
};
