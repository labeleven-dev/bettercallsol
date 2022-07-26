import { DeleteIcon, DragHandleIcon, EditIcon } from "@chakra-ui/icons";
import {
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WritableDraft } from "immer/dist/internal";
import React, { useContext } from "react";
import { FaPenNib, FaWallet } from "react-icons/fa";
import { useInstruction } from "../../hooks/useInstruction";
import { useOptionsStore } from "../../hooks/useOptionsStore";
import { removeFrom } from "../../models/sortable";
import { IAccount } from "../../models/web3";
import { ExplorerButton } from "../common/ExplorerButton";
import { SortableItemContext } from "../common/Sortable";
import { ToggleIconButton } from "../common/ToggleIconButton";
import { TruncatableEditable } from "../common/TruncatableEditable";

export const Account: React.FC<{ data: IAccount; index: number }> = ({
  data,
  index,
}) => {
  const { update } = useInstruction();
  const { listeners, attributes } = useContext(SortableItemContext);
  const rpcEndpoint = useOptionsStore(
    (state) => state.transactionOptions.rpcEndpoint
  );
  const { publicKey: walletPubkey } = useWallet();

  const isWallet = data.pubkey === walletPubkey?.toBase58();

  const updateAccount = (fn: (state: WritableDraft<IAccount>) => void) => {
    update((state) => {
      fn(state.accounts.map[data.id]);
    });
  };

  return (
    <Flex mb="2">
      <DragHandleIcon h="3" w="3" mt="3.5" {...attributes} {...listeners} />
      <Text
        ml="2"
        mt="2"
        w="50px"
        textColor={useColorModeValue("blackAlpha.500", "whiteAlpha.500")}
      >
        #{index + 1}
      </Text>
      <TruncatableEditable
        ml="2"
        mt="2"
        width="100px"
        textAlign="right"
        fontSize="sm"
        value={data.name}
        onChange={(value: string) => {
          updateAccount((state) => {
            state.name = value;
          });
        }}
      ></TruncatableEditable>
      <InputGroup>
        {isWallet && (
          <InputLeftElement
            pointerEvents="none"
            ml="2"
            children={<Icon as={FaWallet} color="gray.400" />}
          />
        )}
        <Input
          flex="1"
          ml="2"
          fontFamily="mono"
          placeholder="Account Public Key"
          value={data.pubkey}
          onChange={(e) => {
            updateAccount((state) => {
              state.pubkey = e.target.value;
            });
          }}
        ></Input>
        <InputRightElement>
          <ExplorerButton
            size="sm"
            valueType="account"
            value={data.pubkey}
            rpcEndpoint={rpcEndpoint}
          />
        </InputRightElement>
      </InputGroup>

      <ToggleIconButton
        ml="1"
        label="Writable"
        icon={<EditIcon />}
        toggled={data.isWritable}
        onToggle={(toggled) => {
          updateAccount((state) => {
            state.isWritable = toggled;
          });
        }}
      />
      <ToggleIconButton
        ml="1"
        label="Signer"
        icon={<Icon as={FaPenNib} />}
        toggled={data.isSigner}
        onToggle={(toggled) => {
          updateAccount((state) => {
            state.isSigner = toggled;
          });
        }}
      />
      <Tooltip label="Remove">
        <IconButton
          aria-label="Remove"
          icon={<DeleteIcon />}
          variant="ghost"
          onClick={() => {
            update((state) => {
              removeFrom(state.accounts, data.id);
            });
          }}
        />
      </Tooltip>
    </Flex>
  );
};
