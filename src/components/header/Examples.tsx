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
import React, { useEffect } from "react";
import { useShallowPersistentStore } from "../../hooks/usePersistentStore";
import {
  useSessionStoreWithoutUndo,
  useSessionStoreWithUndo,
} from "../../hooks/useSessionStore";
import { EXAMPLES } from "../../library/examples";
import { mapITransactionExtToITransaction } from "../../mappers/external-to-internal";
import { DEFAULT_TRANSACTION_RUN } from "../../utils/state";

export const Example: React.FC = () => {
  const setTransaction = useSessionStoreWithUndo((state) => state.set);
  const setTransient = useSessionStoreWithoutUndo((state) => state.set);
  const [firstTime, setPersistent] = useShallowPersistentStore((state) => [
    state.firstTime,
    state.set,
  ]);
  const toast = useToast();

  const loadExample = (name: string) => {
    setTransaction((state) => {
      state.transaction = mapITransactionExtToITransaction(EXAMPLES[name]);
    });
    setTransient((state) => {
      state.transactionRun = DEFAULT_TRANSACTION_RUN;
      state.uiState.descriptionVisible = true;
    });
  };

  useEffect(() => {
    if (!firstTime) {
      return;
    }

    toast({
      title: "Welcome to Better Call Sol!",
      description:
        "To get started, you can try one of the options in the Example menu at the top.",
      status: "info",
      duration: 10000,
      isClosable: true,
    });
    setPersistent((state) => {
      state.firstTime = false;
    });
  }, [firstTime, toast, setPersistent]);

  return (
    <Menu>
      <DarkMode>
        <Tooltip shouldWrapChildren label="Load an example transaction">
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            variant="ghost"
            textColor="white"
          >
            Examples
          </MenuButton>
        </Tooltip>
      </DarkMode>
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
      </MenuList>
    </Menu>
  );
};
