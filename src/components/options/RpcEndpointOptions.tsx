import { AddIcon } from "@chakra-ui/icons";
import { Grid, IconButton, Text, Tooltip } from "@chakra-ui/react";
import { useTransactionStore } from "../../hooks/useTransactionStore";
import { addTo, toSortedArray } from "../../models/sortable";
import { newRpcEndpoint } from "../../models/web3";
import { RpcEndpointOption } from "../common/options/RpcEndpointOption";

export const RpcEndpointOptions: React.FC = () => {
  const rpcEndpoints = useTransactionStore(
    (state) => state.appOptions.rpcEndpoints
  );
  const set = useTransactionStore((state) => state.set);

  return (
    <Grid>
      <Text mb="2">Add or remove custom RPC points, or re-order the list:</Text>
      {toSortedArray(rpcEndpoints).map((rpcEndpoint) => (
        <RpcEndpointOption {...rpcEndpoint} />
      ))}

      <Tooltip label="Add RPC Endpoint">
        <IconButton
          mt="3"
          aria-label="Add RPC Endpoint"
          icon={<AddIcon />}
          variant="ghost"
          onClick={() => {
            set((state) => {
              addTo(state.appOptions.rpcEndpoints, newRpcEndpoint());
            });
          }}
        />
      </Tooltip>
    </Grid>
  );
};
