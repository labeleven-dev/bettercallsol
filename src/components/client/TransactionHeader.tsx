import { ChevronDownIcon, DownloadIcon } from "@chakra-ui/icons";
import {
  Button,
  Editable,
  EditableInput,
  EditablePreview,
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
import { useOptionsStore } from "../../hooks/useOptionsStore";
import { useTransactionStore } from "../../hooks/useTransactionStore";
import { useWeb3Transaction } from "../../hooks/useWeb3Transaction";
import { ITransaction } from "../../models/internal-types";
import { RpcEndpointMenuList } from "../common/RpcEndpointMenuList";

export const TransactionHeader: React.FC<{ transaction: ITransaction }> = ({
  transaction,
}) => {
  const rpcEndpoint = useOptionsStore(
    (state) => state.transactionOptions.rpcEndpoint
  );
  const { results, set, clearTransaction } = useTransactionStore(
    (state) => state
  );
  const setOptions = useOptionsStore((state) => state.set);

  const { publicKey: walletPublicKey } = useWallet();
  const transact = useWeb3Transaction();

  return (
    <Flex mb="5">
      <Tooltip label="Click to edit" placement="top-start">
        <Editable
          flex="1"
          defaultValue={transaction.name}
          onChange={(value) =>
            set((state) => {
              state.transaction.name = value;
            })
          }
        >
          <Heading size="md">
            <EditablePreview minW="200px" minH="23px" />
            <EditableInput />
          </Heading>
        </Editable>
      </Tooltip>
      <Tooltip label="Expand All">
        <IconButton
          ml="2"
          aria-label="Expand All"
          icon={<Icon as={FaExpandAlt} />}
          variant="ghost"
          onClick={() => {
            set((state) => {
              Object.keys(state.uiState.instructions).forEach((id) => {
                state.uiState.instructions[id].expanded = true;
              });
            });
          }}
        />
      </Tooltip>
      <Tooltip label="Collapse All">
        <IconButton
          aria-label="Collapse All"
          icon={<Icon as={FaExpand} />}
          variant="ghost"
          onClick={() => {
            set((state) => {
              Object.keys(state.uiState.instructions).forEach((id) => {
                state.uiState.instructions[id].expanded = false;
              });
            });
          }}
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
              clearTransaction();
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
            setOptions((state) => {
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
