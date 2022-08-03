import { SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Grid,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  Skeleton,
  Tooltip,
} from "@chakra-ui/react";
import { useState } from "react";
import { useGetWeb3Transaction } from "../../hooks/useGetWeb3Transaction";
import { usePersistentStore } from "../../hooks/usePersistentStore";
import { IRpcEndpoint } from "../../models/internal-types";
import { mapToTransactionPreview } from "../../models/preview-mappers";
import { ITransactionPreview } from "../../models/preview-types";
import { ErrorAlert } from "../common/ErrorAlert";
import { ExplorerButton } from "../common/ExplorerButton";
import { RpcEndpointMenuList } from "../common/RpcEndpointMenuList";
import { TransactionPreview } from "./preview/TransactionPreview";

export const ImportTransaction: React.FC = () => {
  const rpcEndpoints = usePersistentStore(
    (state) => state.appOptions.rpcEndpoints
  );
  const [rpcEndpoint, setRpcEndpoint] = useState<IRpcEndpoint>(
    Object.values(rpcEndpoints.map).find(
      (endpoint) => endpoint.network === "mainnet-beta"
    )!
  );
  const [txnAddress, setTxnAddress] = useState("");
  const [transaction, setTransaction] = useState<ITransactionPreview>();
  const [error, setError] = useState("");

  const { start, inProgress } = useGetWeb3Transaction({
    onFinalised: (response) => {
      setTransaction(mapToTransactionPreview(response, rpcEndpoint));
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const search = () => {
    if (!txnAddress) return;
    setTransaction(undefined);
    setError("");
    start(txnAddress, true);
  };

  return (
    <Grid>
      <Flex mb="5">
        <InputGroup flex="1" mr="0.5">
          <Input
            fontFamily="mono"
            placeholder="Transcation ID"
            value={txnAddress}
            onChange={(e) => {
              setTxnAddress(e.target.value);
            }}
          ></Input>
          <InputRightElement>
            <ExplorerButton
              size="sm"
              valueType="tx"
              value={txnAddress}
              rpcEndpoint={rpcEndpoint}
            />
          </InputRightElement>
        </InputGroup>
        <Menu>
          <MenuButton mr="0.5" as={Button}>
            {rpcEndpoint.network[0].toUpperCase()}
          </MenuButton>
          <RpcEndpointMenuList
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

      <ErrorAlert
        error={error}
        onClose={() => {
          setError("");
        }}
      />

      <Skeleton height="200px" isLoaded={!inProgress}>
        {transaction && <TransactionPreview transaction={transaction} />}
      </Skeleton>
    </Grid>
  );
};
