import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import React from "react";
import {
  useSessionStoreWithoutUndo,
  useSessionStoreWithUndo,
} from "../../hooks/useSessionStore";
import { EXAMPLES } from "../../models/examples";
import { mapITransactionExtToITransaction } from "../../models/external-mappers";
import { DEFAULT_TRANSACTION_RUN } from "../../models/state-default";

export const Example: React.FC = () => {
  const { publicKey: walletPublicKey } = useWallet();
  const setTransaction = useSessionStoreWithUndo((state) => state.set);
  const setResults = useSessionStoreWithoutUndo((state) => state.set);

  const toast = useToast();

  const loadExample = (name: string) => {
    const { transaction, help } = EXAMPLES[name];
    setTransaction((state) => {
      state.transaction = mapITransactionExtToITransaction(
        transaction(walletPublicKey?.toBase58()!)
      );
    });
    setResults((state) => {
      state.transactionRun = DEFAULT_TRANSACTION_RUN;
    });

    toast({
      title: "The example has been loaded!",
      description: help,
      status: "info",
      isClosable: true,
      duration: 30_000,
    });
  };

  return (
    <Menu>
      <Tooltip
        shouldWrapChildren
        hasArrow={!walletPublicKey}
        label={
          walletPublicKey
            ? "Load an example transaction"
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

      <MenuList fontSize="md" zIndex="modal">
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
