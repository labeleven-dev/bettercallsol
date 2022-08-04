import { SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  IconButton,
  Input,
  Menu,
  MenuButton,
  Tooltip,
} from "@chakra-ui/react";
import { useState } from "react";
import { useGetWeb3Transaction } from "../../../hooks/useGetWeb3Transaction";
import { usePersistentStore } from "../../../hooks/usePersistentStore";
import { IRpcEndpoint } from "../../../models/internal-types";
import { mapTransactionResponseToITransactionPreview } from "../../../models/preview-mappers";
import { ITransactionPreview } from "../../../models/preview-types";
import { RpcEndpointMenuList } from "../../common/RpcEndpointMenuList";

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
  const { start, inProgress } = useGetWeb3Transaction({
    rpcEndpointUrl: rpcEndpoint.url,
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

      <Menu>
        <MenuButton mr="1" as={Button}>
          {rpcEndpoint.network[0].toUpperCase()}
        </MenuButton>
        <RpcEndpointMenuList
          fontSize="sm"
          endpoint={rpcEndpoint}
          setEndpoint={(endpoint) => {
            setRpcEndpoint(endpoint);
          }}
        />
      </Menu>

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
