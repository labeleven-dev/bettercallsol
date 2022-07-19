import { CheckIcon } from "@chakra-ui/icons";
import { MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import { useTransactionStore } from "../../hooks/useTransactionStore";
import { IRpcEndpoint } from "../../models/web3";

export const RpcEndpointMenuList: React.FC<{
  endpoint: IRpcEndpoint;
  setEndpoint: (endpoint: IRpcEndpoint) => void;
}> = ({ endpoint, setEndpoint }) => {
  const { rpcEndpoints } = useTransactionStore((state) => state.appOptions);

  return (
    <MenuList fontSize="md">
      {rpcEndpoints
        .filter(({ enabled }) => enabled)
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
