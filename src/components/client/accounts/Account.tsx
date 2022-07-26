import { CloseIcon, DragHandleIcon, EditIcon } from "@chakra-ui/icons";
import {
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Tooltip,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WritableDraft } from "immer/dist/internal";
import React, { useContext } from "react";
import { FaPenNib, FaWallet } from "react-icons/fa";
import { useInstruction } from "../../../hooks/useInstruction";
import { useOptionsStore } from "../../../hooks/useOptionsStore";
import { removeFrom } from "../../../models/sortable";
import { IAccount } from "../../../models/web3";
import { ExplorerButton } from "../../common/ExplorerButton";
import { Numbering } from "../../common/Numbering";
import { SortableItemContext } from "../../common/Sortable";
import { ToggleIconButton } from "../../common/ToggleIconButton";
import { TruncatableEditable } from "../../common/TruncatableEditable";

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
      <DragHandleIcon h="2.5" w="2.5" mt="3" {...attributes} {...listeners} />
      <Numbering index={index} ml="2" pt="2" minW="30px" fontSize="sm" />
      <TruncatableEditable
        ml="2"
        mt="1"
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
      <InputGroup size="sm">
        {isWallet && (
          <InputLeftElement
            pointerEvents="none"
            ml="2"
            children={<Icon as={FaWallet} color="gray.400" />}
          />
        )}
        <Input
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
        size="sm"
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
        size="sm"
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
          mt="1"
          ml="3"
          size="xs"
          aria-label="Remove"
          icon={<CloseIcon />}
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
