import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Collapse,
  Flex,
  Heading,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Tooltip,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect } from "react";
import {
  FaCompress,
  FaEllipsisV,
  FaEraser,
  FaExpand,
  FaFileImport,
  FaInfo,
  FaPlay,
  FaShareAlt,
} from "react-icons/fa";
import {
  useConfigStore,
  useShallowConfigStore,
} from "../../hooks/useConfigStore";
import { useSendWeb3Transaction } from "../../hooks/useSendWeb3Transaction";
import {
  useShallowSessionStoreWithoutUndo,
  useShallowSessionStoreWithUndo,
} from "../../hooks/useSessionStore";
import { DEFAULT_TRANSACTION_RUN, EMPTY_TRANSACTION } from "../../utils/state";
import { Description } from "../common/Description";
import { EditableName } from "../common/EditableName";
import { RpcEndpointMenu } from "../common/RpcEndpointMenu";
import { ToggleIconButton } from "../common/ToggleIconButton";

export const TransactionHeader: React.FC<{
  resultsRef: React.RefObject<HTMLDivElement>;
}> = ({ resultsRef }) => {
  const scrollToResults = useConfigStore(
    (state) => state.appOptions.scrollToResults
  );
  const [inProgress, descriptionVisible, setUI] =
    useShallowSessionStoreWithoutUndo((state) => [
      state.transactionRun.inProgress,
      state.uiState.descriptionVisible,
      state.set,
    ]);
  const [transaction, rpcEndpoint, setSession] = useShallowSessionStoreWithUndo(
    (state) => [state.transaction, state.rpcEndpoint, state.set]
  );
  const rpcEndpoints = useShallowConfigStore(
    (state) => state.appOptions.rpcEndpoints
  );

  const { publicKey: walletPublicKey } = useWallet();
  const { send } = useSendWeb3Transaction({
    onSent: (signature) => {
      setUI((state) => {
        state.transactionRun = { inProgress: true, signature };
      });
      if (scrollToResults) {
        resultsRef.current?.scrollIntoView({
          block: "end",
          inline: "nearest",
          behavior: "smooth",
        });
      }
    },
    onError: (error) => {
      setUI((state) => {
        state.transactionRun.error = error.message;
      });
      if (scrollToResults) {
        resultsRef.current?.scrollIntoView({
          block: "end",
          inline: "nearest",
          behavior: "smooth",
        });
      }
    },
  });

  const setAllExpanded = (value: boolean) => () => {
    setSession((state) => {
      state.transaction.instructions.order.forEach((id) => {
        state.transaction.instructions.map[id].expanded = value;
      });
    });
  };

  useEffect(() => {
    // when rpc endpoints setting change, update the current selected rpc
    if (rpcEndpoints.map.hasOwnProperty(rpcEndpoint.id)) {
      setSession((state) => {
        state.rpcEndpoint = rpcEndpoints.map[rpcEndpoint.id];
      });
    }
  }, [rpcEndpoints, rpcEndpoint, setSession]);

  return (
    <>
      <Flex alignItems="center">
        <RpcEndpointMenu
          menuButtonProps={{ minW: "250px", maxW: "250px" }}
          menuListProps={{ fontSize: "md" }}
          endpoint={rpcEndpoint}
          setEndpoint={(endpoint) => {
            setSession((state) => {
              state.rpcEndpoint = endpoint;
            });
          }}
        />

        <Tooltip
          shouldWrapChildren
          hasArrow={!walletPublicKey}
          label={
            walletPublicKey
              ? "Run Transaction"
              : "Please connect a wallet to continue"
          }
        >
          <Button
            isLoading={inProgress}
            isDisabled={!walletPublicKey}
            ml="2"
            mr="2"
            colorScheme="purple"
            aria-label="Run Program"
            rightIcon={<Icon as={FaPlay} />}
            onClick={() => {
              setUI((state) => {
                state.transactionRun = DEFAULT_TRANSACTION_RUN;
              });
              send(transaction);
            }}
          >
            Send
          </Button>
        </Tooltip>

        <Spacer />

        <ToggleIconButton
          ml="1"
          label={
            descriptionVisible ? "Hide annotations" : "Display annotations"
          }
          icon={<Icon as={FaInfo} />}
          toggled={descriptionVisible}
          onToggle={(toggled) => {
            setUI((state) => {
              state.uiState.descriptionVisible = toggled;
            });
          }}
        />

        <Tooltip label="Import">
          <IconButton
            aria-label="Import"
            icon={<Icon as={FaFileImport} />}
            variant="ghost"
            onClick={() => {
              setUI((state) => {
                state.uiState.paletteOpen = true;
              });
            }}
          />
        </Tooltip>

        <Tooltip label="Share">
          <IconButton
            aria-label="Share"
            icon={<Icon as={FaShareAlt} />}
            variant="ghost"
            onClick={() => {
              setUI((state) => {
                state.uiState.shareOpen = true;
              });
            }}
          />
        </Tooltip>

        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<Icon as={FaEllipsisV} />}
            variant="ghost"
          />
          <MenuList zIndex="modal">
            <MenuItem
              icon={<Icon as={FaExpand} />}
              onClick={setAllExpanded(true)}
            >
              Expand All
            </MenuItem>
            <MenuItem
              icon={<Icon as={FaCompress} />}
              onClick={setAllExpanded(false)}
            >
              Collapse All
            </MenuItem>
            <MenuItem
              icon={<Icon as={FaEraser} />}
              onClick={() => {
                setSession((state) => {
                  state.transaction = EMPTY_TRANSACTION;
                });
                setUI((state) => {
                  state.transactionRun = DEFAULT_TRANSACTION_RUN;
                });
              }}
            >
              Clear
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      {/* TODO remove once out of beta */}
      <Collapse in={rpcEndpoint.network === "mainnet-beta"} unmountOnExit>
        <Alert
          mt="2"
          fontSize="sm"
          rounded="sm"
          status="warning"
          variant="left-accent"
        >
          <AlertIcon />
          <AlertDescription>
            This is a pre-GA version of Better Call Sol. Use Mainnet at your own
            risk!
          </AlertDescription>
        </Alert>
      </Collapse>

      <Heading mt="5" mb="2" alignItems="center" flex="1" size="lg">
        <EditableName
          tooltip="Click to edit"
          tooltipProps={{ placement: "bottom-start" }}
          previewProps={{ p: "3px 10px 3px 10px" }}
          inputProps={{ p: "3px 10px 3px 10px" }}
          placeholder="Unnamed Transaction"
          value={transaction.name}
          onChange={(value) =>
            setSession((state) => {
              state.transaction.name = value;
            })
          }
        />
      </Heading>

      <Description
        ml="3"
        mb="3"
        description={transaction.description}
        setDescription={(description) => {
          setSession((state) => {
            state.transaction.description = description;
          });
        }}
      />
    </>
  );
};
