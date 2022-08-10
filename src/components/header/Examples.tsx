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

  const loadExample = (name: string) => {
    setTransaction((state) => {
      state.transaction = mapITransactionExtToITransaction(
        EXAMPLES[name](walletPublicKey?.toBase58()!)
      );
    });
    setResults((state) => {
      state.transactionRun = DEFAULT_TRANSACTION_RUN;
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
