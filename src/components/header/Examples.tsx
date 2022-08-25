import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  DarkMode,
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
import { EXAMPLES } from "../../library/examples";
import { mapITransactionExtToITransaction } from "../../mappers/external-to-internal";
import { DEFAULT_TRANSACTION_RUN } from "../../utils/state";

export const Example: React.FC = () => {
  const { publicKey: walletPublicKey } = useWallet();
  const setTransaction = useSessionStoreWithUndo((state) => state.set);
  const setResults = useSessionStoreWithoutUndo((state) => state.set);

  const toast = useToast();

  const loadExample = (name: string) => {
    const { transaction, help } = EXAMPLES[name];
    setTransaction((state) => {
      state.transaction = mapITransactionExtToITransaction(transaction);
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
      <DarkMode>
        <Tooltip
          shouldWrapChildren
          hasArrow={!walletPublicKey}
          label={
            walletPublicKey
              ? "Load an example transaction"
              : "Please connect a wallet to continue"
          }
        >
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            variant="ghost"
            textColor="white"
            isDisabled={!walletPublicKey}
            data-cy="example-btn"
          >
            Examples
          </MenuButton>
        </Tooltip>
      </DarkMode>
      <MenuList fontSize="md" zIndex="modal">
        <MenuItem
          data-cy="example-systemProgramTransfer"
          onClick={() => {
            loadExample("systemProgramTransfer");
          }}
        >
          System Program: Transfer SOL
        </MenuItem>
        <MenuItem
          data-cy="example-systemProgramCreateAccount"
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
