import { AddIcon } from "@chakra-ui/icons";
import { Grid, IconButton, Text, Tooltip } from "@chakra-ui/react";
import { useOptionsStore } from "../../hooks/useOptionsStore";
import { newRpcEndpoint } from "../../models/internal-mappers";
import { addTo, toSortedArray } from "../../models/sortable";
import { Sortable } from "../common/Sortable";
import { RpcEndpointOption } from "./common/RpcEndpointOption";

export const RpcEndpointOptions: React.FC = () => {
  const rpcEndpoints = useOptionsStore(
    (state) => state.appOptions.rpcEndpoints
  );
  const set = useOptionsStore((state) => state.set);

  return (
    <Grid>
      <Text mb="2">Add or remove custom RPC points, or re-order the list:</Text>
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
