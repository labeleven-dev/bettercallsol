import { SearchIcon, TriangleDownIcon } from "@chakra-ui/icons";
import { Button, ButtonGroup, Flex, Input, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { useGetWeb3Transaction } from "../../../hooks/useGetWeb3Transaction";
import { usePersistentStore } from "../../../hooks/usePersistentStore";
import { useWeb3Connection } from "../../../hooks/useWeb3Connection";
import { mapTransactionResponseToIPreview } from "../../../mappers/web3js-to-preview";
import { IRpcEndpoint } from "../../../types/internal";
import { IPreview } from "../../../types/preview";
import { RpcEndpointMenu } from "../../common/RpcEndpointMenu";

export const TransactionIdImport: React.FC<{
  setPreview: (tranaction: IPreview | undefined) => void;
  setError: (error: string) => void;
}> = ({ setPreview, setError }) => {
  const rpcEndpoints = usePersistentStore(
    (state) => state.appOptions.rpcEndpoints
  );

  const [transactionId, setTransactionId] = useState("");
  const [rpcEndpoint, setRpcEndpoint] = useState<IRpcEndpoint>(
    Object.values(rpcEndpoints.map).find(
      (endpoint) => endpoint.network === "mainnet-beta"
    )!
  );

  const connection = useWeb3Connection(rpcEndpoint.url);
  const { start, inProgress } = useGetWeb3Transaction({
    connection,
    onSuccess: (response) => {
      setPreview(mapTransactionResponseToIPreview(response, rpcEndpoint));
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const search = () => {
    if (!transactionId) return;

    setPreview(undefined);
    setError("");

    start(transactionId, true);
  };

  return (
    <Flex>
      <Input
        flex="1"
        mr="1"
        size="sm"
        fontFamily="mono"
        placeholder="Transaction ID"
        value={transactionId}
        onChange={(e) => {
          setTransactionId(e.target.value);
        }}
      />

      <ButtonGroup isAttached size="sm">
        <Tooltip label="Search">
          <Button
            isLoading={inProgress}
            leftIcon={<SearchIcon />}
            onClick={search}
          >
            {rpcEndpoint.network}
          </Button>
        </Tooltip>

        <RpcEndpointMenu
          variant="icon"
          menuButtonProps={{
            icon: <TriangleDownIcon />,
            isLoading: inProgress,
          }}
          menuListProps={{ fontSize: "sm" }}
          endpoint={rpcEndpoint}
          setEndpoint={setRpcEndpoint}
        />
      </ButtonGroup>
    </Flex>
  );
};
