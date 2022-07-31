import { CheckIcon } from "@chakra-ui/icons";
import { MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import { usePersistentStore } from "../../hooks/usePersistentStore";
import { IRpcEndpoint } from "../../models/internal-types";
import { toSortedArray } from "../../models/sortable";

export const RpcEndpointMenuList: React.FC<{
  endpoint: IRpcEndpoint;
  setEndpoint: (endpoint: IRpcEndpoint) => void;
}> = ({ endpoint, setEndpoint }) => {
  const { rpcEndpoints } = usePersistentStore((state) => state.appOptions);

  return (
    <MenuList fontSize="md">
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
  );
};
