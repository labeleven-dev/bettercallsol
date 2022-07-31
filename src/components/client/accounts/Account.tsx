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
  useToast,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import { WritableDraft } from "immer/dist/internal";
import React, { useContext } from "react";
import { FaKey, FaParachuteBox, FaPenNib, FaWallet } from "react-icons/fa";
import { useInstruction } from "../../../hooks/useInstruction";
import { usePersistentStore } from "../../../hooks/usePersistentStore";
import { useSessionStore } from "../../../hooks/useSessionStore";
import { IAccount } from "../../../models/internal-types";
import { removeFrom } from "../../../models/sortable";
import { isValidPublicKey } from "../../../models/web3js-mappers";
import { EditableName } from "../../common/EditableName";
import { ExplorerButton } from "../../common/ExplorerButton";
import { Numbering } from "../../common/Numbering";
import { SortableItemContext } from "../../common/Sortable";
import { ToggleIconButton } from "../../common/ToggleIconButton";

export const Account: React.FC<{ data: IAccount; index: number }> = ({
  data,
  index,
}) => {
  const { update } = useInstruction();
  const { listeners, attributes } = useContext(SortableItemContext);
  const rpcEndpoint = usePersistentStore(
    (state) => state.transactionOptions.rpcEndpoint
  );
  const { publicKey: walletPubkey } = useWallet();
  const { keypairs, set: setSession } = useSessionStore((state) => state);
  const toast = useToast();

  const isValid = isValidPublicKey(data.pubkey);
  const isWallet = data.pubkey === walletPubkey?.toBase58();
  const hasPrivateKey = Object.keys(keypairs).includes(data.pubkey);

  const updateAccount = (fn: (state: WritableDraft<IAccount>) => void) => {
    update((state) => {
      fn(state.accounts.map[data.id]);
    });
  };

  const removeAccount = () => {
    update((state) => {
      removeFrom(state.accounts, data.id);
    });
    if (hasPrivateKey) {
      setSession((state) => {
        delete state.keypairs[data.pubkey];
      });
    }
  };

  const generateKeypair = () => {
    const keypair = Keypair.generate();
    const publicKey = keypair.publicKey.toBase58();
    setSession((state) => {
      state.keypairs[publicKey] = keypair.secretKey;
    });
    updateAccount((state) => {
      state.pubkey = publicKey;
      state.isSigner = true;
    });
    toast({
      title: "Keypair has been successfully created!",
      description:
        "Private keys are stored in memory only. They will not survive page reloads.",
      status: "info",
      duration: 8000,
      isClosable: true,
    });
  };

  return (
    <Flex mb="2">
      <DragHandleIcon h="2.5" w="2.5" mt="3" {...attributes} {...listeners} />

      <Numbering index={index} ml="2" pt="2" minW="30px" fontSize="sm" />

      <EditableName
        ml="2"
        mt="1"
        width="100px"
        textAlign="right"
        fontSize="sm"
        placeholder="Unnamed"
        value={data.name}
        onChange={(value: string) => {
          updateAccount((state) => {
            state.name = value;
          });
        }}
      />

      <InputGroup size="sm">
        {isWallet && (
          <InputLeftElement
            pointerEvents="none"
            ml="2"
            children={<Icon as={FaWallet} color="gray.400" />}
          />
        )}
        {hasPrivateKey && (
          <InputLeftElement pointerEvents="none" ml="2">
            <Icon as={FaKey} color="gray.400" />
          </InputLeftElement>
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
        <InputRightElement w="65px">
          {isValid ? (
            <>
              <Tooltip label="Airdrop SOL">
                <IconButton
                  ml="1"
                  size="xs"
                  variant="ghost"
                  aria-label="Airdrop SOL"
                  icon={<FaParachuteBox />}
                  isDisabled={rpcEndpoint.network === "mainnet-beta"}
                />
              </Tooltip>
              <ExplorerButton
                size="xs"
                valueType="account"
                value={data.pubkey}
                rpcEndpoint={rpcEndpoint}
              />
            </>
          ) : (
            <>
              <Tooltip label="Use Wallet">
                <IconButton
                  ml="1"
                  size="xs"
                  variant="ghost"
                  aria-label="Use Wallet"
                  icon={<Icon as={FaWallet} />}
                />
              </Tooltip>
              <Tooltip label="Generate Keypair">
                <IconButton
                  size="xs"
                  variant="ghost"
                  aria-label="Generate Keypair"
                  icon={<Icon as={FaKey} />}
                  onClick={generateKeypair}
                />
              </Tooltip>
            </>
          )}
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
          onClick={removeAccount}
        />
      </Tooltip>
    </Flex>
  );
};
