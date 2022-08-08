import { SearchIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Input, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { useGetWeb3Transaction } from "../../../hooks/useGetWeb3Transaction";
import { usePersistentStore } from "../../../hooks/usePersistentStore";
import { useWeb3Connection } from "../../../hooks/useWeb3Connection";
import { IRpcEndpoint } from "../../../models/internal-types";
import { mapTransactionResponseToITransactionPreview } from "../../../models/preview-mappers";
import { ITransactionPreview } from "../../../models/preview-types";
import { RpcEndpointMenu } from "../../common/RpcEndpointMenu";

export const TransactionIdImport: React.FC<{
  setTransaction: (tranaction: ITransactionPreview | undefined) => void;
  setError: (error: string) => void;
}> = ({ setTransaction, setError }) => {
  const rpcEndpoints = usePersistentStore(
    (state) => state.appOptions.rpcEndpoints
  );

  const [tranasctionId, setTransactionId] = useState("");
  const [rpcEndpoint, setRpcEndpoint] = useState<IRpcEndpoint>(
    Object.values(rpcEndpoints.map).find(
      (endpoint) => endpoint.network === "mainnet-beta"
    )!
  );

  const connection = useWeb3Connection(rpcEndpoint.url);
  const { start, inProgress } = useGetWeb3Transaction({
    connection,
    onFinalised: (response) => {
      setTransaction(
        mapTransactionResponseToITransactionPreview(response, rpcEndpoint)
      );
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const search = () => {
    if (!tranasctionId) return;

    setTransaction(undefined);
    setError("");

    start(tranasctionId, true);
  };

  return (
    <Flex>
      <Input
        flex="1"
        mr="1"
        fontFamily="mono"
        placeholder="Transaction ID"
        value={tranasctionId}
        onChange={(e) => {
          setTransactionId(e.target.value);
        }}
      />

      <RpcEndpointMenu
        variant="short"
        menuButtonProps={{ mr: "1" }}
        menuListProps={{ fontSize: "sm" }}
        endpoint={rpcEndpoint}
        setEndpoint={setRpcEndpoint}
      />

      <Tooltip label="Search">
        <IconButton
          isLoading={inProgress}
          aria-label="Search"
          icon={<SearchIcon />}
          onClick={search}
        />
      </Tooltip>
    </Flex>
  );
};
