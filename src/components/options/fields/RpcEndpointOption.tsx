import { DeleteIcon } from "@chakra-ui/icons";
import {
  Flex,
  Grid,
  Icon,
  IconButton,
  Input,
  Select,
  Tooltip,
} from "@chakra-ui/react";
import { WritableDraft } from "immer/dist/internal";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { usePersistentStore } from "../../../hooks/usePersistentStore";
import { INetwork, IRpcEndpoint } from "../../../types/internal";
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
  const setUrl = (url: string) => {
    if (!isValidUrl(url)) return;
    set((state) => {
      state.appOptions.rpcEndpoints.map[id].url = url;
    });
  };

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
          <Select
            minW="150px"
            maxW="130px"
            mr="1"
            isDisabled={!custom}
            value={network}
            onChange={(e) =>
              updateEndpoint((state) => {
                state.network = e.target.value as INetwork;
              })
            }
          >
            {RPC_NETWORK_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Select>
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
            setUrl(notValidatedUrl);
          }}
        />
      </Grid>
    </Flex>
  );
};
