import { TriangleDownIcon } from "@chakra-ui/icons";
import {
  Button,
  ButtonGroup,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Tooltip,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSendToSquads } from "hooks/squads";
import { useConfigStore } from "hooks/useConfigStore";
import { useSendWeb3Transaction } from "hooks/useSendWeb3Transaction";
import {
  useSessionStoreWithUndo,
  useShallowSessionStoreWithoutUndo,
} from "hooks/useSessionStore";
import { TransactionBuilderArgs } from "hooks/useWeb3TranasctionBuilder";
import {
  extractBalancesFromSimulation,
  mapWeb3TransactionError,
} from "mappers/web3js-to-internal";
import React, { useMemo } from "react";
import { IPubKey } from "types/internal";
import { DEFAULT_TRANSACTION_RUN } from "utils/state";
import { RUN_TYPES, SIMULATED_SIGNATURE } from "utils/ui-constants";

export const SendButton: React.FC<{
  startGet: (signature: IPubKey, skipPolling?: boolean) => void;
  resultsRef: React.RefObject<HTMLDivElement>;
}> = ({ startGet, resultsRef }) => {
  const scrollToResults = useConfigStore(
    (state) => state.appOptions.scrollToResults
  );
  const [runType, inProgress, setUI] = useShallowSessionStoreWithoutUndo(
    (state) => [
      state.uiState.runType,
      state.transactionRun.inProgress,
      state.set,
    ]
  );

  const { publicKey: walletPublicKey } = useWallet();

  const { name: runName, icon: runIcon } = useMemo(
    () => RUN_TYPES.find(({ id }) => runType === id)!,
    [runType]
  );

  // TODO causes component reload
  const transaction = useSessionStoreWithUndo((state) => state.transaction);

  const scrollDown = () => {
    if (scrollToResults) {
      resultsRef.current?.scrollIntoView({
        block: "end",
        inline: "nearest",
        behavior: "smooth",
      });
    }
  };

  const onSimulated: TransactionBuilderArgs["onSimulated"] = (
    response,
    { transaction, recentBlockhash, lastValidBlockHeight }
  ) => {
    setUI((state) => {
      state.transactionRun = {
        inProgress: false,
        signature: SIMULATED_SIGNATURE,
        confirmationStatus: "simulated",
        confirmations: 0,
        lastValidBlockHeight,
        recentBlockhash,
        error: mapWeb3TransactionError(response.value.err),
        logs: response.value.logs ?? [],
        unitsConsumed: response.value.unitsConsumed,
        slot: response.context.slot,
        balances: extractBalancesFromSimulation(
          response.value,
          transaction.message
        ),
        // TODO returnData
      };
    });
    scrollDown();
  };

  const onSent: TransactionBuilderArgs["onSent"] = (
    signature,
    { recentBlockhash, lastValidBlockHeight }
  ) => {
    setUI((state) => {
      state.transactionRun.signature = signature;
      state.transactionRun.recentBlockhash = recentBlockhash;
      state.transactionRun.lastValidBlockHeight = lastValidBlockHeight;
    });
    startGet(signature);
    scrollDown();
  };

  const onError: TransactionBuilderArgs["onError"] = (error) => {
    setUI((state) => {
      state.transactionRun.inProgress = false;
      state.transactionRun.error = error.message;
    });
    scrollDown();
  };

  const { simulate, send } = useSendWeb3Transaction({
    onSimulated,
    onSent,
    onError,
  });

  const { simulate: squadsSimulate, send: squadsSend } = useSendToSquads({
    onSimulated,
    onSent,
    onError,
  });

  const onClick = () => {
    setUI((state) => {
      state.transactionRun = {
        ...DEFAULT_TRANSACTION_RUN,
        inProgress: true,
      };
    });

    if (runType === "simulate") {
      simulate(transaction);
    } else if (runType === "send") {
      send(transaction);
    } else if (runType === "squadsSimulate") {
      squadsSimulate(transaction);
    } else if (runType === "squadsSend") {
      squadsSend(transaction);
    }
  };

  const menuItems = (items: typeof RUN_TYPES) =>
    items.map(({ id, name, icon }, index) => (
      <MenuItem
        key={index}
        icon={icon}
        onClick={() => {
          setUI((state) => {
            state.uiState.runType = id;
          });
        }}
      >
        {name}
      </MenuItem>
    ));

  return (
    <Tooltip
      shouldWrapChildren
      hasArrow={!walletPublicKey}
      label={
        walletPublicKey
          ? "Send transaction"
          : "Please connect a wallet to continue"
      }
    >
      <ButtonGroup isAttached>
        <Button
          isLoading={inProgress}
          isDisabled={!walletPublicKey}
          ml="2"
          w="fit-content"
          colorScheme="green"
          aria-label="Send transaction"
          rightIcon={runIcon}
          onClick={onClick}
        >
          {runName}
        </Button>
        <Menu placement="right-start">
          <MenuButton
            as={IconButton}
            minW="5"
            mr="2"
            variant="outline"
            colorScheme="green"
            aria-label="More"
            icon={<TriangleDownIcon w="2" />}
          />
          <MenuList fontSize="md">
            {menuItems(RUN_TYPES.filter(({ type }) => type === "standard"))}
            <MenuDivider />
            <MenuGroup title="Integrations">
              {menuItems(
                RUN_TYPES.filter(({ type }) => type === "integration")
              )}
            </MenuGroup>
          </MenuList>
        </Menu>
      </ButtonGroup>
    </Tooltip>
  );
};
