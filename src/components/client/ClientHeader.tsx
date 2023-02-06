import { CheckIcon, ChevronDownIcon } from "@chakra-ui/icons";
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
import { Description } from "components/common/Description";
import { EditableName } from "components/common/EditableName";
import { RpcEndpointMenu } from "components/common/RpcEndpointMenu";
import { ToggleIconButton } from "components/common/ToggleIconButton";
import { useShallowConfigStore } from "hooks/useConfigStore";
import {
  useShallowSessionStoreWithoutUndo,
  useShallowSessionStoreWithUndo,
} from "hooks/useSessionStore";
import React, { useEffect } from "react";
import {
  FaCompress,
  FaEllipsisV,
  FaEraser,
  FaExpand,
  FaFileImport,
  FaInfo,
  FaShareAlt,
} from "react-icons/fa";
import { DEFAULT_TRANSACTION_RUN, EMPTY_TRANSACTION } from "utils/state";
import { TRANSACTION_VERSIONS } from "utils/ui-constants";

export const ClientHeader: React.FC<{ sendButton: React.ReactNode }> = ({
  sendButton,
}) => {
  const [runType, descriptionVisible, setUI] =
    useShallowSessionStoreWithoutUndo((state) => [
      state.uiState.runType,
      state.uiState.descriptionVisible,
      state.set,
    ]);

  const [
    transactionVersion,
    transactionName,
    transactionDescription,
    rpcEndpoint,
    setSession,
  ] = useShallowSessionStoreWithUndo((state) => [
    state.transaction.version,
    state.transaction.name,
    state.transaction.description,
    state.rpcEndpoint,
    state.set,
  ]);
  const rpcEndpoints = useShallowConfigStore(
    (state) => state.appOptions.rpcEndpoints
  );

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
                TRANSACTION_VERSIONS.find(({ id }) => id === transactionVersion)
                  ?.name
              }
            </MenuButton>
          </Tooltip>
          {/* avoid z-index issues with it rendering before other compoents that may clash with it */}
          <MenuList fontSize="md" zIndex="modal">
            {TRANSACTION_VERSIONS.map(({ id, name, description }, index) => (
              <MenuItem
                key={index}
                icon={transactionVersion === id ? <CheckIcon /> : undefined}
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

        {sendButton}

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
            mr="4"
            as={IconButton}
            aria-label="Options"
            icon={<Icon as={FaEllipsisV} />}
            variant="ghost"
          />
          <MenuList fontSize="md" zIndex="modal">
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
          previewProps={{
            p: "3px 10px 3px 10px",
            mr: "12", // to avoid collision with sidebar button
          }}
          inputProps={{
            p: "3px 10px 3px 10px",
            mr: "12", // to avoid collision with sidebar buttons
          }}
          placeholder="Unnamed Transaction"
          value={transactionName}
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
        description={transactionDescription}
        setDescription={(description) => {
          setSession((state) => {
            state.transaction.description = description;
          });
        }}
      />
    </>
  );
};
