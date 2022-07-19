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
import { PublicKey } from "@solana/web3.js";
import React, { ChangeEvent, useContext } from "react";
import { FaPenNib, FaWallet } from "react-icons/fa";
import { useTransactionStore } from "../../hooks/useTransactionStore";
import { accountGetter } from "../../models/state";
import { ExplorerButton } from "../common/ExplorerButton";
import { SortableItemProps } from "../common/SortableItem";
import { ToggleIconButton } from "../common/ToggleIconButton";
import { TruncatableEditable } from "../common/TruncatableEditable";
import { InstructionContext } from "./Instructions";

export const Account: React.FC<{ index: number } & SortableItemProps> = ({
  id,
  index,
  attributes,
  listeners,
  setNodeRef,
  style,
}) => {
  const instruction = useContext(InstructionContext);
  const getAccount = accountGetter(instruction.id, id);

  const account = useTransactionStore(getAccount);
  const network = useTransactionStore(
    (state) => state.transactionOptions.rpcEndpoint.network
  );
  const set = useTransactionStore((state) => state.set);

  const { publicKey: walletPubkey } = useWallet();
  const isWallet = account.pubkey === walletPubkey?.toBase58();

  const setPubKey = (e: ChangeEvent<HTMLInputElement>) => {
    set((state) => {
      getAccount(state).pubkey = e.target.value;
      if (PublicKey.isOnCurve(e.target.value)) {
      }
    });
  };

  const removeAccount = () => {
    set((state) => {
      const ixn = state.transaction.instructions[instruction.id];
      ixn.accountOrder = instruction.accountOrder.filter((x) => x !== id);
      delete ixn.accounts[id];
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
        value={account.name}
        onChange={(value: string) => {
          set((state) => {
            getAccount(state).name = value;
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
          id={account.id}
          flex="1"
          ml="2"
          fontFamily="mono"
          placeholder="Account Public Key"
          value={account.pubkey}
          onChange={setPubKey}
        ></Input>
        <InputRightElement>
          <ExplorerButton
            size="sm"
            valueType="account"
            value={account.pubkey}
            network={network}
          />
        </InputRightElement>
      </InputGroup>

      <ToggleIconButton
        ml="1"
        label="Writable"
        icon={<EditIcon />}
        initialToggled={account.isWritable}
        onToggled={(toggled) => {
          set((state) => {
            getAccount(state).isWritable = toggled;
          });
        }}
      />
      <ToggleIconButton
        ml="1"
        label="Signer"
        icon={<Icon as={FaPenNib} />}
        initialToggled={account.isSigner}
        onToggled={(toggled) => {
          set((state) => {
            getAccount(state).isSigner = toggled;
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
