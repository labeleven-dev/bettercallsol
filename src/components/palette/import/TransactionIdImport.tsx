import { SearchIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Input, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { useGetWeb3Transaction } from "../../../hooks/useGetWeb3Transaction";
import { usePersistentStore } from "../../../hooks/usePersistentStore";
import { useWeb3Connection } from "../../../hooks/useWeb3Connection";
import { IRpcEndpoint } from "../../../models/internal-types";
import { mapTransactionResponseToIPreview } from "../../../models/preview-mappers";
import { IPreview } from "../../../models/preview-types";
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
    onFinalised: (response) => {
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
        fontFamily="mono"
        placeholder="Transaction ID"
        value={transactionId}
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
