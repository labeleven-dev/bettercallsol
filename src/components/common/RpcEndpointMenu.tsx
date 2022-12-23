import { CheckIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  IconButtonProps,
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuItem,
  MenuList,
  MenuListProps,
  MenuProps,
  Portal,
  Tooltip,
} from "@chakra-ui/react";
import { useConfigStore } from "hooks/useConfigStore";
import React from "react";
import { IRpcEndpoint } from "types/internal";
import { toSortedArray } from "utils/sortable";

export const RpcEndpointMenu: React.FC<{
  endpoint: IRpcEndpoint;
  setEndpoint: (endpoint: IRpcEndpoint) => void;
  variant?: "long" | "short" | "icon";
  menuProps?: MenuProps;
  menuButtonProps?: MenuButtonProps | Omit<IconButtonProps, "aria-label">;
  menuListProps?: MenuListProps;
}> = ({
  endpoint,
  setEndpoint,
  variant = "long",
  menuProps,
  menuButtonProps,
  menuListProps,
}) => {
  const rpcEndpoints = useConfigStore((state) => state.appOptions.rpcEndpoints);

  return (
    <Menu {...menuProps}>
      <Tooltip label={endpoint.url}>
        <MenuButton
          as={variant === "icon" ? IconButton : Button}
          rightIcon={variant === "long" ? <ChevronDownIcon /> : undefined}
          {...menuButtonProps}
        >
          {variant === "long"
            ? `${endpoint.network}${
                endpoint.provider ? " (" + endpoint.provider + ")" : ""
              }`
            : variant === "short"
            ? endpoint.network[0].toUpperCase()
            : undefined}
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
