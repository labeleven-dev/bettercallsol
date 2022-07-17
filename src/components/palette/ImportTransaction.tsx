import { CheckIcon, SearchIcon } from "@chakra-ui/icons";
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
  MenuItem,
  MenuList,
  Tooltip,
} from "@chakra-ui/react";
import { Cluster, clusterApiUrl, Connection } from "@solana/web3.js";
import { useCallback, useMemo, useState } from "react";
import { useTransactionStore } from "../../hooks/useTransactionStore";
import {
  ITransactionPreview,
  mapToTransactionPreview,
} from "../../models/preview";
import { DEFAULT_NETWORKS } from "../../models/web3";
import { ExplorerButton } from "../common/ExplorerButton";
import { TransactionPreview } from "../common/preview/TransactionPreview";

export const ImportTransaction: React.FC = () => {
  const transactionOptions = useTransactionStore(
    (state) => state.transactionOptions
  );
  const [network, setNetwork] = useState("mainnet-beta");
  const [txnAddress, setTxnAddress] = useState(
    "4uz94jQaK9zCf1SBwg8o4nY5FtX3M75EZfEDYoM8GBBKCg9E8bN2kJHgB7uDobYqVpeasbVkD9qE3hoSLWsQfZ69"
  ); // TODO empty
  const [transaction, setTransaction] = useState<ITransactionPreview>();

  const endpoint = clusterApiUrl(network as Cluster);
  const connection = useMemo(() => {
    // TODO more efficient?
    const {
      commitment,
      confirmTransactionInitialTimeout,
      disableRetryOnRateLimit,
    } = transactionOptions;
    return new Connection(endpoint, {
      commitment,
      confirmTransactionInitialTimeout,
      disableRetryOnRateLimit,
    });
  }, [endpoint, transactionOptions]);

  const search = useCallback(async () => {
    // TODO error handling
    const response = await connection.getTransaction(txnAddress, {
      commitment: "finalized",
    });
    if (response) {
      setTransaction(mapToTransactionPreview(response));
    } else {
      // TODO
    }
  }, [txnAddress, connection]);

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
            <ExplorerButton size="sm" valueType="tx" value={txnAddress} />
          </InputRightElement>
        </InputGroup>
        <Menu>
          <MenuButton mr="0.5" as={Button}>
            {network[0].toUpperCase()}
          </MenuButton>
          <MenuList>
            {DEFAULT_NETWORKS.slice()
              .reverse()
              .map(({ id, name }) => (
                <MenuItem
                  icon={network === id ? <CheckIcon /> : undefined}
                  onClick={() => {
                    setNetwork(id);
                  }}
                  key={id}
                >
                  {name}
                </MenuItem>
              ))}
          </MenuList>
        </Menu>
        <Tooltip label="Search">
          <IconButton
            aria-label="Search"
            icon={<SearchIcon />}
            onClick={search}
          />
        </Tooltip>
      </Flex>
      {transaction && <TransactionPreview transaction={transaction} />}
    </Grid>
  );
};
