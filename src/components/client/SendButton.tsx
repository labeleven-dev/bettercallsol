import { CheckIcon, TriangleDownIcon } from "@chakra-ui/icons";
import {
  Button,
  ButtonGroup,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConfigStore } from "hooks/useConfigStore";
import { useSendWeb3Transaction } from "hooks/useSendWeb3Transaction";
import {
  useSessionStoreWithUndo,
  useShallowSessionStoreWithoutUndo,
} from "hooks/useSessionStore";
import {
  extractBalancesFromSimulation,
  mapWeb3TransactionError,
} from "mappers/web3js-to-internal";
import React from "react";
import { FaFlask, FaPlay } from "react-icons/fa";
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
  // TODO causes component reload
  const transaction = useSessionStoreWithUndo((state) => state.transaction);

  const { publicKey: walletPublicKey } = useWallet();

  const scrollDown = () => {
    if (scrollToResults) {
      resultsRef.current?.scrollIntoView({
        block: "end",
        inline: "nearest",
        behavior: "smooth",
      });
    }
  };

  // send the web3 transaction/simulation
  const { simulate, send } = useSendWeb3Transaction({
    onSimulated: (response, tranaction) => {
      setUI((state) => {
        state.transactionRun = {
          inProgress: false,
          signature: SIMULATED_SIGNATURE,
          confirmationStatus: "simulated",
          confirmations: 0,
          error: mapWeb3TransactionError(response.value.err),
          logs: response.value.logs ?? [],
          unitsConsumed: response.value.unitsConsumed,
          slot: response.context.slot,
          balances: extractBalancesFromSimulation(
            response.value,
            tranaction.message
          ),
          // TODO returnData
        };
      });
      scrollDown();
    },
    onSent: (signature) => {
      setUI((state) => {
        state.transactionRun.signature = signature;
      });
      startGet(signature);
      scrollDown();
    },
    onError: (error) => {
      setUI((state) => {
        state.transactionRun.inProgress = false;
        state.transactionRun.error = error.message;
      });
      scrollDown();
    },
  });

  return (
    <Tooltip
      shouldWrapChildren
      hasArrow={!walletPublicKey}
      label={
        walletPublicKey
          ? "Run Transaction"
          : "Please connect a wallet to continue"
      }
    >
      <ButtonGroup isAttached>
        <Button
          isLoading={inProgress}
          isDisabled={!walletPublicKey}
          ml="2"
          w="110px"
          colorScheme="green"
          aria-label="Run Program"
          rightIcon={<Icon as={runType === "simulate" ? FaFlask : FaPlay} />}
          onClick={() => {
            setUI((state) => {
              state.transactionRun = {
                ...DEFAULT_TRANSACTION_RUN,
                inProgress: true,
              };
            });
            if (runType === "simulate") {
              simulate(transaction);
            } else {
              send(transaction);
            }
          }}
        >
          {RUN_TYPES.find(({ id }) => id === runType)?.name}
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
            {RUN_TYPES.map(({ id, name }, index) => (
              <MenuItem
                key={index}
                icon={id === runType ? <CheckIcon /> : undefined}
                onClick={() => {
                  setUI((state) => {
                    state.uiState.runType = id;
                  });
                }}
              >
                {name}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </ButtonGroup>
    </Tooltip>
  );
};
