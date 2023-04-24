import { TriangleDownIcon } from "@chakra-ui/icons";
import {
  Button,
  ButtonGroup,
  Icon,
  IconButton,
  IconProps,
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
import { FaFlask, FaPlay } from "react-icons/fa";
import { IPubKey } from "types/internal";
import { RunType } from "types/state";
import { DEFAULT_TRANSACTION_RUN } from "utils/state";
import { SIMULATED_SIGNATURE } from "utils/ui-constants";

const SquadsIcon: React.FC<IconProps> = (props) => (
  <Icon w="5" h="5" viewBox="0 0 34 54" {...props}>
    <path
      d="M 33.14 19.106 L 28.535 14.501 L 24.902 10.861 C 24.833 10.793 24.76 10.727 24.686 10.666 C 24.161 10.237 23.504 10.001 22.825 10 L 11.176 10 C 10.498 10.001 9.841 10.236 9.316 10.666 C 9.241 10.727 9.169 10.793 9.1 10.861 L 5.468 14.493 L 0.863 19.099 C 0.59 19.372 0.373 19.696 0.225 20.053 C 0.077 20.41 0 20.793 0 21.179 L 0 32.828 C -0 33.215 0.076 33.598 0.224 33.955 C 0.372 34.312 0.59 34.636 0.863 34.909 L 9.1 43.148 C 9.169 43.217 9.241 43.282 9.316 43.334 C 9.841 43.764 10.498 43.999 11.176 44 L 22.825 44 C 23.504 43.999 24.161 43.763 24.686 43.334 C 24.76 43.273 24.833 43.207 24.902 43.148 L 33.139 34.909 C 33.412 34.636 33.628 34.311 33.776 33.954 C 33.924 33.597 34 33.215 34 32.828 L 34 21.179 C 33.998 20.402 33.689 19.657 33.14 19.106 Z M 29.509 27.018 L 29.509 36.784 C 29.508 37.144 29.436 37.5 29.298 37.832 C 29.159 38.164 28.957 38.466 28.702 38.719 C 28.447 38.973 28.144 39.174 27.811 39.311 C 27.479 39.447 27.122 39.517 26.762 39.516 L 7.226 39.516 C 6.867 39.516 6.511 39.445 6.179 39.308 C 5.847 39.17 5.545 38.969 5.291 38.715 C 5.036 38.46 4.835 38.159 4.697 37.827 C 4.56 37.494 4.489 37.138 4.49 36.779 L 4.49 17.242 C 4.489 16.882 4.56 16.526 4.697 16.194 C 4.835 15.861 5.036 15.559 5.291 15.305 C 5.545 15.051 5.846 14.849 6.179 14.711 C 6.511 14.574 6.867 14.503 7.226 14.503 L 26.762 14.503 C 27.489 14.503 28.185 14.791 28.699 15.305 C 29.213 15.819 29.501 16.515 29.501 17.242 L 29.501 27.02 Z"
      fill="currentColor"
    ></path>
  </Icon>
);

export const RUN_TYPES: {
  id: RunType;
  type: "standard" | "integration";
  name: string;
  icon: JSX.Element;
}[] = [
  { id: "send", name: "Send", type: "standard", icon: <Icon as={FaPlay} /> },
  {
    id: "squads",
    name: "Send to Squads",
    type: "integration",
    icon: <SquadsIcon />,
  },
];

export const SendButton: React.FC<{
  startGet: (signature: IPubKey, skipPolling?: boolean) => void;
  resultsRef: React.RefObject<HTMLDivElement>;
}> = ({ startGet, resultsRef }) => {
  const scrollToResults = useConfigStore(
    (state) => state.appOptions.scrollToResults
  );
  const [runType, simulate, inProgress, setUI] =
    useShallowSessionStoreWithoutUndo((state) => [
      state.uiState.runType,
      state.uiState.simulate,
      state.transactionRun.inProgress,
      state.set,
    ]);

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

  const { simulate: sendSimulate, send } = useSendWeb3Transaction({
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

    if (runType === "send" && simulate) {
      sendSimulate(transaction);
    } else if (runType === "send" && !simulate) {
      send(transaction);
    } else if (runType === "squads" && simulate) {
      squadsSimulate(transaction);
    } else if (runType === "squads" && !simulate) {
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
          ? simulate
            ? "Simulate transaction"
            : "Send transaction"
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
          rightIcon={simulate ? <Icon as={FaFlask} /> : runIcon}
          boxShadow={!simulate ? "0 0 8px 1px #9AE6B4" : undefined}
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
            boxShadow={!simulate ? "0 0 8px 1px #9AE6B4" : undefined}
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
