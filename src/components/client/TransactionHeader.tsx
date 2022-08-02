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
import { useSendWeb3Transaction } from "../../hooks/useSendWeb3Transaction";
import {
  useSessionStoreWithoutUndo,
  useSessionStoreWithUndo,
} from "../../hooks/useSessionStore";
import { ITransaction } from "../../models/internal-types";
import {
  DEFAULT_TRANSACTION,
  DEFAULT_TRANSACTION_RUN,
} from "../../models/state-default";
import { EditableName } from "../common/EditableName";
import { RpcEndpointMenuList } from "../common/RpcEndpointMenuList";

export const TransactionHeader: React.FC<{ transaction: ITransaction }> = ({
  transaction,
}) => {
  const [transactionRun, setTransactionRun] = useSessionStoreWithoutUndo(
    (state) => [state.transactionRun, state.set]
  );
  const [rpcEndpoint, setSession] = useSessionStoreWithUndo((state) => [
    state.rpcEndpoint,
    state.set,
  ]);

  const { publicKey: walletPublicKey } = useWallet();
  const { send } = useSendWeb3Transaction({
    onSent: (signature) => {
      setTransactionRun((state) => {
        state.transactionRun = { inProgress: true, signature };
      });
    },
    onError: (error) => {
      setTransactionRun((state) => {
        state.transactionRun.error = error.message;
      });
    },
  });

  const setAllExpanded = (value: boolean) => () => {
    setSession((state) => {
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
            setSession((state) => {
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
              setSession((state) => {
                state.transaction = DEFAULT_TRANSACTION;
              });
              setTransactionRun((state) => {
                state.transactionRun = DEFAULT_TRANSACTION_RUN;
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
            setSession((state) => {
              state.rpcEndpoint = endpoint;
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
          isLoading={transactionRun.inProgress}
          isDisabled={!walletPublicKey}
          ml="2"
          mr="2"
          colorScheme="main"
          color="main.500"
          borderWidth="2px"
          variant="outline"
          aria-label="Run Program"
          icon={<Icon as={FaPlay} />}
          onClick={() => {
            send(transaction);
          }}
        />
      </Tooltip>
    </Flex>
  );
};
