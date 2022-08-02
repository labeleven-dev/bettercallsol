import { AddIcon } from "@chakra-ui/icons";
import { Grid, IconButton, Text, Tooltip } from "@chakra-ui/react";
import { usePersistentStore } from "../../hooks/usePersistentStore";
import { newRpcEndpoint } from "../../models/internal-mappers";
import { addTo, toSortedArray } from "../../models/sortable";
import { Sortable } from "../common/Sortable";
import { RpcEndpointOption } from "./fields/RpcEndpointOption";

export const RpcEndpointOptions: React.FC = () => {
  const [rpcEndpoints, set] = usePersistentStore((state) => [
    state.appOptions.rpcEndpoints,
    state.set,
  ]);

  return (
    <Grid>
      <Text mb="2">Re-order RPC endpoints or manage custom endpoints.</Text>
      <Sortable
        itemOrder={rpcEndpoints.order}
        setItemOrder={(itemOrder) => {
          set((state) => {
            state.appOptions.rpcEndpoints.order = itemOrder;
          });
        }}
      >
        {toSortedArray(rpcEndpoints).map((rpcEndpoint, index) => (
          <RpcEndpointOption key={index} {...rpcEndpoint} />
        ))}
      </Sortable>

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
