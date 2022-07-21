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
import { Connection } from "@solana/web3.js";
import { useCallback, useMemo, useState } from "react";
import { useOptionsStore } from "../../hooks/useOptionsStore";
import {
  ITransactionPreview,
  mapToTransactionPreview,
} from "../../models/preview";
import { IRpcEndpoint } from "../../models/web3";
import { ErrorAlert } from "../common/ErrorAlert";
import { ExplorerButton } from "../common/ExplorerButton";
import { TransactionPreview } from "../common/preview/TransactionPreview";
import { RpcEndpointMenuList } from "../common/RpcEndpointMenuList";

export const ImportTransaction: React.FC = () => {
  const rpcEndpoints = useOptionsStore(
    (state) => state.appOptions.rpcEndpoints
  );
  const transactionOptions = useOptionsStore(
    (state) => state.transactionOptions
  );

  const [rpcEndpoint, setRpcEndpoint] = useState<IRpcEndpoint>(
    rpcEndpoints.map[rpcEndpoints.order[0]]
  );
  const [txnAddress, setTxnAddress] = useState(
    "4uz94jQaK9zCf1SBwg8o4nY5FtX3M75EZfEDYoM8GBBKCg9E8bN2kJHgB7uDobYqVpeasbVkD9qE3hoSLWsQfZ69"
  ); // TODO empty
  const [transaction, setTransaction] = useState<ITransactionPreview>();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const connection = useMemo(() => {
    const {
      commitment,
      confirmTransactionInitialTimeout,
      disableRetryOnRateLimit,
    } = transactionOptions;
    return new Connection(rpcEndpoint.url, {
      commitment,
      confirmTransactionInitialTimeout,
      disableRetryOnRateLimit,
    });
  }, [rpcEndpoint, transactionOptions]);

  const search = useCallback(async () => {
    if (!txnAddress) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await connection.getTransaction(txnAddress, {
        commitment: "finalized",
      });
      if (response) {
        setTransaction(mapToTransactionPreview(response, rpcEndpoint));
      } else {
        setError("Transaction not found");
        setTransaction(undefined);
      }
    } catch (err) {
      setLoading(false);
      setError((err as { message: string }).message);
    }

    setLoading(false);
  }, [txnAddress, rpcEndpoint, connection]);

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
            isLoading={isLoading}
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

      <Skeleton height="200px" isLoaded={!isLoading}>
        {transaction && <TransactionPreview transaction={transaction} />}
      </Skeleton>
    </Grid>
  );
};
