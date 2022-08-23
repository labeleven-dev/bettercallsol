import { CheckIcon, ChevronDownIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Grid,
  Icon,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Tooltip,
} from "@chakra-ui/react";
import { WritableDraft } from "immer/dist/internal";
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { usePersistentStore } from "../../../hooks/usePersistentStore";
import { IRpcEndpoint } from "../../../types/internal";
import { removeFrom } from "../../../utils/sortable";
import { RPC_NETWORK_OPTIONS } from "../../../utils/state";
import { DragHandle } from "../../common/DragHandle";

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const RpcEndpointOption: React.FC<IRpcEndpoint> = ({
  id,
  network,
  provider,
  url,
  custom,
  enabled,
}) => {
  const set = usePersistentStore((state) => state.set);

  const updateEndpoint = (fn: (state: WritableDraft<IRpcEndpoint>) => void) => {
    set((state) => {
      fn(state.appOptions.rpcEndpoints.map[id]);
    });
  };

  // TODO is this best way?
  const [notValidatedUrl, setNotValidatedUrl] = useState(url);

  useEffect(() => {
    const setUrl = (url: string) => {
      if (!isValidUrl(url)) return;

      set((state) => {
        if (
          !Object.values(state.appOptions.rpcEndpoints.map)
            .map((element) => element.url)
            .includes(url)
        ) {
          state.appOptions.rpcEndpoints.map[id].url = url;
        }
      });
    };
    setUrl(notValidatedUrl);
  }, [notValidatedUrl, id, set]);

  return (
    <Flex alignItems="center">
      <DragHandle unlockedProps={{ h: "3", w: "3", mr: "1" }} />

      <Grid
        p="4"
        flex="1"
        rounded="md"
        boxShadow="md"
        bg={
          enabled
            ? ""
            : "repeating-linear-gradient(-45deg, transparent, transparent 40px, #85858510 40px, #85858510 80px)"
        }
      >
        <Flex mb="1">
          <Menu>
            <MenuButton
              rightIcon={<ChevronDownIcon />}
              minW="150px"
              as={Button}
              disabled={!custom}
              mr="1"
            >
              {network}
            </MenuButton>
            <Portal>
              <MenuList minW="150px" mr="1" zIndex="modal">
                {RPC_NETWORK_OPTIONS.map((n) => (
                  <MenuItem
                    icon={network === n ? <CheckIcon /> : undefined}
                    key={n}
                    onClick={() => {
                      updateEndpoint((state) => {
                        state.network = n;
                      });
                    }}
                  >
                    {n}
                  </MenuItem>
                ))}
              </MenuList>
            </Portal>
          </Menu>
          <Input
            flex="1"
            mr="1"
            placeholder="Provider"
            value={provider}
            isReadOnly={!custom}
            onChange={(e) => {
              updateEndpoint((state) => {
                state.provider = e.target.value;
              });
            }}
          />
          <Tooltip label={enabled ? "Disable" : "Enable"}>
            <IconButton
              mr="1"
              aria-label={enabled ? "Disable" : "Enable"}
              variant="ghost"
              icon={enabled ? <Icon as={FaEye} /> : <Icon as={FaEyeSlash} />}
              onClick={() => {
                updateEndpoint((state) => {
                  state.enabled = !enabled;
                });
              }}
            />
          </Tooltip>
          <Tooltip label="Remove">
            <IconButton
              aria-label="Remove"
              icon={<DeleteIcon />}
              variant="ghost"
              isDisabled={!custom}
              onClick={() => {
                set((state) => {
                  removeFrom(state.appOptions.rpcEndpoints, id);
                });
              }}
            />
          </Tooltip>
        </Flex>

        <Input
          flex="1"
          mr="1"
          placeholder="RPC URL"
          fontFamily="mono"
          value={notValidatedUrl}
          isReadOnly={!custom}
          isInvalid={!isValidUrl(notValidatedUrl)}
          onChange={(e) => {
            setNotValidatedUrl(e.target.value);
          }}
        />
      </Grid>
    </Flex>
  );
};
