import { ChevronDownIcon, DownloadIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import React from "react";
import {
  FaEllipsisV,
  FaEraser,
  FaExpand,
  FaExpandAlt,
  FaPlay,
  FaShareAlt,
} from "react-icons/fa";
import { usePersistentStore } from "../../hooks/usePersistentStore";
import {
  useSessionStoreWithoutUndo,
  useSessionStoreWithUndo,
} from "../../hooks/useSessionStore";
import { useWeb3Transaction } from "../../hooks/useWeb3Transaction";
import { ITransaction } from "../../models/internal-types";
import {
  DEFAULT_RESULTS,
  DEFAULT_TRANSACTION,
} from "../../models/state-default";
import { EditableName } from "../common/EditableName";
import { RpcEndpointMenuList } from "../common/RpcEndpointMenuList";

export const TransactionHeader: React.FC<{ transaction: ITransaction }> = ({
  transaction,
}) => {
  const { results, set: setResults } = useSessionStoreWithoutUndo(
    (state) => state
  );
  const setTransaction = useSessionStoreWithUndo((state) => state.set);
  const {
    transactionOptions: { rpcEndpoint },
    set: setPersistent,
  } = usePersistentStore((state) => state);

  const { publicKey: walletPublicKey } = useWallet();
  const transact = useWeb3Transaction();

  const setAllExpanded = (value: boolean) => () => {
    setTransaction((state) => {
      state.transaction.instructions.order.forEach((id) => {
        state.transaction.instructions.map[id].expanded = value;
      });
    });
  };

  return (
    <Flex mb="5">
      <Heading flex="1" size="lg">
        <EditableName
          tooltip="Click to edit"
          placeholder="Unnamed Tranasction"
          value={transaction.name}
          onChange={(value) =>
            setTransaction((state) => {
              state.transaction.name = value;
            })
          }
        />
      </Heading>

      <Tooltip label="Expand All">
        <IconButton
          ml="2"
          aria-label="Expand All"
          icon={<Icon as={FaExpandAlt} />}
          variant="ghost"
          onClick={setAllExpanded(true)}
        />
      </Tooltip>

      <Tooltip label="Collapse All">
        <IconButton
          aria-label="Collapse All"
          icon={<Icon as={FaExpand} />}
          variant="ghost"
          onClick={setAllExpanded(false)}
        />
      </Tooltip>

      <Menu>
        <MenuButton
          mr="2"
          as={IconButton}
          aria-label="Options"
          icon={<Icon as={FaEllipsisV} />}
          variant="ghost"
        />
        <MenuList>
          {/* TODO implement */}
          <MenuItem icon={<Icon as={FaShareAlt} />} isDisabled>
            Share
          </MenuItem>
          {/* TODO implement */}
          <MenuItem icon={<DownloadIcon />} isDisabled>
            Download
          </MenuItem>
          <MenuItem
            icon={<Icon as={FaEraser} />}
            onClick={() => {
              setTransaction((state) => {
                state.transaction = DEFAULT_TRANSACTION;
              });
              setResults((state) => {
                state.results = DEFAULT_RESULTS;
              });
            }}
          >
            Clear
          </MenuItem>
        </MenuList>
      </Menu>

      <Menu>
        <Tooltip label={rpcEndpoint.url}>
          <MenuButton
            minW="180px"
            maxW="250px"
            as={Button}
            rightIcon={<ChevronDownIcon />}
          >
            {`${rpcEndpoint.network}${
              rpcEndpoint.provider ? " (" + rpcEndpoint.provider + ")" : ""
            }`}
          </MenuButton>
        </Tooltip>
        <RpcEndpointMenuList
          endpoint={rpcEndpoint}
          setEndpoint={(endpoint) => {
            setPersistent((state) => {
              state.transactionOptions.rpcEndpoint = endpoint;
            });
          }}
        />
      </Menu>

      <Tooltip
        shouldWrapChildren
        hasArrow={!walletPublicKey}
        label={
          walletPublicKey
            ? "Run Program"
            : "Please connect a wallet to contiune"
        }
      >
        <IconButton
          isLoading={results.inProgress}
          isDisabled={!walletPublicKey}
          ml="2"
          mr="2"
          colorScheme="main"
          color="main.500"
          borderWidth="2px"
          variant="outline"
          aria-label="Run Program"
          icon={<Icon as={FaPlay} />}
          onClick={transact}
        />
      </Tooltip>
    </Flex>
  );
};
