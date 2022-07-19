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
import React, { ChangeEvent, useContext } from "react";
import { FaPenNib, FaWallet } from "react-icons/fa";
import { useTransactionStore } from "../../hooks/useTransactionStore";
import { AppState } from "../../models/state";
import { IAccount } from "../../models/web3";
import { ExplorerButton } from "../common/ExplorerButton";
import { SortableItemProps } from "../common/SortableItem";
import { ToggleIconButton } from "../common/ToggleIconButton";
import { TruncatableEditable } from "../common/TruncatableEditable";
import { InstructionContext } from "./Instructions";

export const Account: React.FC<
  { data: IAccount; index: number } & SortableItemProps
> = ({ data, index, attributes, listeners, setNodeRef, style }) => {
  const instruction = useContext(InstructionContext);
  const account = (state: WritableDraft<AppState>) =>
    state.transaction.instructions[instruction.id].accounts[data.id];

  const network = useTransactionStore(
    (state) => state.transactionOptions.rpcEndpoint.network
  );
  const set = useTransactionStore((state) => state.set);

  const { publicKey: walletPubkey } = useWallet();
  const isWallet = data.pubkey === walletPubkey?.toBase58();

  const setPubKey = (e: ChangeEvent<HTMLInputElement>) => {
    set((state) => {
      account(state).pubkey = e.target.value;
    });
  };

  const removeAccount = () => {
    set((state) => {
      const ixn = state.transaction.instructions[instruction.id];
      ixn.accountOrder = instruction.accountOrder.filter((x) => x !== data.id);
      delete ixn.accounts[data.id];
    });
  };

  return (
    <Flex mb="2" ref={setNodeRef} style={style}>
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
          set((state) => {
            account(state).name = value;
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
          onChange={setPubKey}
        ></Input>
        <InputRightElement>
          <ExplorerButton
            size="sm"
            valueType="account"
            value={data.pubkey}
            network={network}
          />
        </InputRightElement>
      </InputGroup>

      <ToggleIconButton
        ml="1"
        label="Writable"
        icon={<EditIcon />}
        toggled={data.isWritable}
        onToggle={(toggled) => {
          set((state) => {
            account(state).isWritable = toggled;
          });
        }}
      />
      <ToggleIconButton
        ml="1"
        label="Signer"
        icon={<Icon as={FaPenNib} />}
        toggled={data.isSigner}
        onToggle={(toggled) => {
          set((state) => {
            account(state).isSigner = toggled;
          });
        }}
      />
      <Tooltip label="Remove">
        <IconButton
          aria-label="Remove"
          icon={<DeleteIcon />}
          variant="ghost"
          onClick={removeAccount}
        />
      </Tooltip>
    </Flex>
  );
};
