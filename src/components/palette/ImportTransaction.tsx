import { CheckIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Grid,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Tooltip,
} from "@chakra-ui/react";
import { useState } from "react";
import { useGetWeb3Transaction } from "../../hooks/useGetWeb3Transaction";
import { usePersistentStore } from "../../hooks/usePersistentStore";
import { IRpcEndpoint } from "../../models/internal-types";
import { mapTransactionResponseToITransactionPreview } from "../../models/preview-mappers";
import { ITransactionPreview, PreviewSource } from "../../models/preview-types";
import { ErrorAlert } from "../common/ErrorAlert";
import { RpcEndpointMenuList } from "../common/RpcEndpointMenuList";
import { TransactionPreview } from "./preview/TransactionPreview";

const IMPORT_TYPES: Record<PreviewSource, string> = {
  tx: "Transaction ID",
  shareUrl: "Share URL",
};

export const ImportTransaction: React.FC = () => {
  const [importType, setImportType] = useState<PreviewSource>("tx");
  const [importValue, setImportValue] = useState("");
  const [transaction, setTransaction] = useState<ITransactionPreview>();
  const [error, setError] = useState("");

  const rpcEndpoints = usePersistentStore(
    (state) => state.appOptions.rpcEndpoints
  );
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
    if (!importValue) return;

    setTransaction(undefined);
    setError("");

    if (importType === "tx") {
      start(importValue, true);
    } else if (importType === "shareUrl") {
      // TODO
    }
  };

  return (
    <Grid>
      <Flex mb="1">
        <Menu>
          <MenuButton flex="1" as={Button} mr="1" size="sm">
            {IMPORT_TYPES[importType]} <ChevronDownIcon />
          </MenuButton>
          <MenuList fontSize="sm">
            {Object.entries(IMPORT_TYPES).map(([type, label]) => (
              <MenuItem
                key={type}
                icon={type === importType ? <CheckIcon /> : undefined}
                onClick={() => {
                  setImportType(type as PreviewSource);
                }}
              >
                {label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton flex="1" as={Button} size="sm">
            {rpcEndpoint.network} <ChevronDownIcon />
          </MenuButton>
          <RpcEndpointMenuList
            fontSize="sm"
            endpoint={rpcEndpoint}
            setEndpoint={(endpoint) => {
              setRpcEndpoint(endpoint);
            }}
          />
        </Menu>
      </Flex>

      <Flex mb="5">
        <Input
          flex="1"
          mr="1"
          fontFamily="mono"
          placeholder={importType === "tx" ? "Transaction ID" : "URL"}
          value={importValue}
          onChange={(e) => {
            setImportValue(e.target.value);
          }}
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
