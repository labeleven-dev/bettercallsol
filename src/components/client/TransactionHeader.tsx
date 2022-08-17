import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Collapse,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Tooltip,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import React from "react";
import {
  FaCompress,
  FaEllipsisV,
  FaEraser,
  FaExpand,
  FaFileImport,
  FaPlay,
  FaShareAlt,
} from "react-icons/fa";
import { useSendWeb3Transaction } from "../../hooks/useSendWeb3Transaction";
import {
  useSessionStoreWithoutUndo,
  useSessionStoreWithUndo,
} from "../../hooks/useSessionStore";
import { ITransaction } from "../../types/internal";
import { DEFAULT_TRANSACTION_RUN, EMPTY_TRANSACTION } from "../../utils/state";
import { RpcEndpointMenu } from "../common/RpcEndpointMenu";

export const TransactionHeader: React.FC<{ transaction: ITransaction }> = ({
  transaction,
}) => {
  const [transactionRun, setUI] = useSessionStoreWithoutUndo((state) => [
    state.transactionRun,
    state.set,
  ]);
  const [rpcEndpoint, setSession] = useSessionStoreWithUndo((state) => [
    state.rpcEndpoint,
    state.set,
  ]);

  const { publicKey: walletPublicKey } = useWallet();
  const { send } = useSendWeb3Transaction({
    onSent: (signature) => {
      setUI((state) => {
        state.transactionRun = { inProgress: true, signature };
      });
    },
    onError: (error) => {
      setUI((state) => {
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
    <>
      <Flex alignItems="center">
        <RpcEndpointMenu
          menuButtonProps={{ minW: "250px", maxW: "250px" }}
          menuListProps={{ fontSize: "md" }}
          endpoint={rpcEndpoint}
          setEndpoint={(endpoint) => {
            setSession((state) => {
              state.rpcEndpoint = endpoint;
            });
          }}
        />

        <Tooltip
          shouldWrapChildren
          hasArrow={!walletPublicKey}
          label={
            walletPublicKey
              ? "Run Transaction"
              : "Please connect a wallet to continue"
          }
        >
          <Button
            isLoading={transactionRun.inProgress}
            isDisabled={!walletPublicKey}
            ml="2"
            mr="2"
            colorScheme="purple"
            aria-label="Run Program"
            rightIcon={<Icon as={FaPlay} />}
            onClick={() => {
              setUI((state) => {
                state.transactionRun = DEFAULT_TRANSACTION_RUN;
              });
              send(transaction);
            }}
          >
            Send
          </Button>
        </Tooltip>

        <Spacer />

        <Tooltip label="Import">
          <IconButton
            aria-label="Import"
            icon={<Icon as={FaFileImport} />}
            variant="ghost"
            onClick={() => {
              setUI((state) => {
                state.uiState.paletteOpen = true;
              });
            }}
          />
        </Tooltip>

        <Tooltip label="Share">
          <IconButton
            aria-label="Share"
            icon={<Icon as={FaShareAlt} />}
            variant="ghost"
            onClick={() => {
              setUI((state) => {
                state.uiState.shareOpen = true;
              });
            }}
          />
        </Tooltip>

        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<Icon as={FaEllipsisV} />}
            variant="ghost"
          />
          <MenuList zIndex="modal">
            <MenuItem
              icon={<Icon as={FaExpand} />}
              onClick={() => {
                setAllExpanded(true);
              }}
            >
              Expand All
            </MenuItem>
            <MenuItem
              icon={<Icon as={FaCompress} />}
              onClick={() => {
                setAllExpanded(false);
              }}
            >
              Collapse All
            </MenuItem>
            <MenuItem
              icon={<Icon as={FaEraser} />}
              onClick={() => {
                setSession((state) => {
                  state.transaction = EMPTY_TRANSACTION;
                });
                setUI((state) => {
                  state.transactionRun = DEFAULT_TRANSACTION_RUN;
                });
              }}
            >
              Clear
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      {/* TODO remove once out of beta */}
      <Collapse in={rpcEndpoint.network === "mainnet-beta"} unmountOnExit>
        <Alert
          mt="2"
          fontSize="sm"
          rounded="sm"
          status="warning"
          variant="left-accent"
        >
          <AlertIcon />
          <AlertDescription>
            This is a pre-GA version of Better Call Sol. Use Mainnet at your own
            risk!
          </AlertDescription>
        </Alert>
      </Collapse>
    </>
  );
};
