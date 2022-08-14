import { CheckIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuItem,
  MenuList,
  MenuListProps,
  Portal,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import { usePersistentStore } from "../../hooks/usePersistentStore";
import { IRpcEndpoint } from "../../types/internal";
import { toSortedArray } from "../../utils/sortable";

export const RpcEndpointMenu: React.FC<{
  endpoint: IRpcEndpoint;
  setEndpoint: (endpoint: IRpcEndpoint) => void;
  variant?: "long" | "short";
  menuButtonProps?: MenuButtonProps;
  menuListProps?: MenuListProps;
}> = ({
  endpoint,
  setEndpoint,
  variant = "long",
  menuButtonProps,
  menuListProps,
}) => {
  const rpcEndpoints = usePersistentStore(
    (state) => state.appOptions.rpcEndpoints
  );

  return (
    <Menu>
      <Tooltip label={endpoint.url}>
        <MenuButton
          as={Button}
          rightIcon={variant === "long" ? <ChevronDownIcon /> : undefined}
          {...menuButtonProps}
        >
          {variant === "long"
            ? `${endpoint.network}${
                endpoint.provider ? " (" + endpoint.provider + ")" : ""
              }`
            : endpoint.network[0].toUpperCase()}
        </MenuButton>
      </Tooltip>

      {/* avoid z-index issues with it rendering before other compoents that may clash with it */}
      <Portal>
        <MenuList {...menuListProps} zIndex="modal">
          {toSortedArray(rpcEndpoints)
            .filter(({ enabled, url }) => enabled && url)
            .map((it, index) => (
              <MenuItem
                icon={endpoint.url === it.url ? <CheckIcon /> : undefined}
                key={index}
                command={it.provider}
                onClick={() => {
                  setEndpoint(it);
                }}
              >
                {it.network}
              </MenuItem>
            ))}
        </MenuList>
      </Portal>
    </Menu>
  );
};
