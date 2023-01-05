import { CheckIcon, ChevronDownIcon, TriangleDownIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  ButtonGroup,
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
import { Description } from "components/common/Description";
import { EditableName } from "components/common/EditableName";
import { RpcEndpointMenu } from "components/common/RpcEndpointMenu";
import { ToggleIconButton } from "components/common/ToggleIconButton";
import { useConfigStore, useShallowConfigStore } from "hooks/useConfigStore";
import { useSendWeb3Transaction } from "hooks/useSendWeb3Transaction";
import {
  useShallowSessionStoreWithoutUndo,
  useShallowSessionStoreWithUndo,
} from "hooks/useSessionStore";
import {
  extractBalancesFromSimulation,
  mapWeb3TransactionError,
} from "mappers/web3js-to-internal";
import React, { useEffect } from "react";
import {
  FaCompress,
  FaEllipsisV,
  FaEraser,
  FaExpand,
  FaFileImport,
  FaFlask,
  FaInfo,
  FaPlay,
  FaShareAlt,
} from "react-icons/fa";
import { DEFAULT_TRANSACTION_RUN, EMPTY_TRANSACTION } from "utils/state";
import {
  RUN_TYPES,
  SIMULATED_SIGNATURE,
  TRANSACTION_VERSIONS,
} from "utils/ui-constants";

export const ClientHeader: React.FC<{
  resultsRef: React.RefObject<HTMLDivElement>;
}> = ({ resultsRef }) => {
  const scrollToResults = useConfigStore(
    (state) => state.appOptions.scrollToResults
  );
  const [runType, inProgress, descriptionVisible, setUI] =
    useShallowSessionStoreWithoutUndo((state) => [
      state.uiState.runType,
      state.transactionRun.inProgress,
      state.uiState.descriptionVisible,
      state.set,
    ]);
  // TODO causes component reload
  const [transaction, rpcEndpoint, setSession] = useShallowSessionStoreWithUndo(
    (state) => [state.transaction, state.rpcEndpoint, state.set]
  );
  const rpcEndpoints = useShallowConfigStore(
    (state) => state.appOptions.rpcEndpoints
  );

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
  const { simulate, send } = useSendWeb3Transaction({
    onSimulated: (response, tranaction) => {
      setUI((state) => {
        state.transactionRun = {
          inProgress: false, // instantenous
          signature: SIMULATED_SIGNATURE,
          error: mapWeb3TransactionError(response.value.err),
        };
        // TODO returnData
        state.simulationResults = {
          logs: response.value.logs ?? [],
          unitsConsumed: response.value.unitsConsumed,
          slot: response.context.slot,
          balances: extractBalancesFromSimulation(
            response.value,
            tranaction.message
          ),
        };
      });
      scrollDown();
    },
    onSent: (signature) => {
      setUI((state) => {
        state.transactionRun = { inProgress: true, signature };
      });
      scrollDown();
    },
    onError: (error) => {
      setUI((state) => {
        state.transactionRun.error = error.message;
        if (runType === "simulate") {
          state.transactionRun.signature = SIMULATED_SIGNATURE; // trigger results
        }
      });
      scrollDown();
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
        <Menu>
          <Tooltip label="Transaction version">
            <MenuButton
              as={Button}
              mr="2"
              minW="120px"
              rightIcon={<ChevronDownIcon />}
            >
              {
                TRANSACTION_VERSIONS.find(
                  ({ id }) => id === transaction.version
                )?.name
              }
            </MenuButton>
          </Tooltip>
          {/* avoid z-index issues with it rendering before other compoents that may clash with it */}
          <MenuList fontSize="md" zIndex="modal">
            {TRANSACTION_VERSIONS.map(({ id, name, description }, index) => (
              <MenuItem
                key={index}
                icon={transaction.version === id ? <CheckIcon /> : undefined}
                command={description}
                onClick={() => {
                  setSession((state) => {
                    state.transaction.version = id;
                  });
                }}
              >
                {name}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

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
          <ButtonGroup isAttached>
            <Button
              isLoading={inProgress}
              isDisabled={!walletPublicKey}
              ml="2"
              w="110px"
              colorScheme="purple"
              aria-label="Run Program"
              rightIcon={
                <Icon as={runType === "simulate" ? FaFlask : FaPlay} />
              }
              onClick={() => {
                setUI((state) => {
                  state.transactionRun = DEFAULT_TRANSACTION_RUN;
                  state.simulationResults = undefined;
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
                colorScheme="purple"
                aria-label="More"
                icon={<TriangleDownIcon w="2" />}
              />
              <MenuList>
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
      <Collapse
        in={runType === "send" && rpcEndpoint.network === "mainnet-beta"}
        unmountOnExit
      >
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
