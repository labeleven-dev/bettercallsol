import { AddIcon } from "@chakra-ui/icons";
import { Grid, IconButton, Text, Tooltip } from "@chakra-ui/react";
import { Sortable } from "components/common/Sortable";
import { RpcEndpointOption } from "components/options/fields/RpcEndpointOption";
import { useShallowConfigStore } from "hooks/useConfigStore";
import { newRpcEndpoint } from "utils/internal";
import { appendTo, toSortedArray } from "utils/sortable";

export const RpcEndpointOptions: React.FC = () => {
  const [rpcEndpoints, set] = useShallowConfigStore((state) => [
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
              appendTo(state.appOptions.rpcEndpoints, newRpcEndpoint());
            });
          }}
        />
      </Tooltip>
    </Grid>
  );
};
