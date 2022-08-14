import { CloseIcon, EditIcon } from "@chakra-ui/icons";
import {
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Tooltip,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import { WritableDraft } from "immer/dist/internal";
import React from "react";
import { FaKey, FaPenNib, FaWallet } from "react-icons/fa";
import { useInstruction } from "../../../hooks/useInstruction";
import { useSessionStoreWithUndo } from "../../../hooks/useSessionStore";
import { IAccount } from "../../../types/internal";
import { removeFrom } from "../../../utils/sortable";
import { isValidPublicKey } from "../../../utils/web3js";
import { DragHandle } from "../../common/DragHandle";
import { EditableName } from "../../common/EditableName";
import { ExplorerButton } from "../../common/ExplorerButton";
import { Numbering } from "../../common/Numbering";
import { ToggleIconButton } from "../../common/ToggleIconButton";
import { AirdropButton } from "./AirdropButton";
import { PdaButton } from "./PdaButton";

export const Account: React.FC<{
  account: IAccount;
  index: number;
  isAnchor?: boolean;
}> = ({
  account: { id, name, pubkey, isWritable, isSigner },
  index,
  isAnchor = false,
}) => {
  const {
    instruction: { programId },
    update,
  } = useInstruction();

  const { publicKey: walletPubkey } = useWallet();
  const [rpcEndpoint, keypairs, setSession] = useSessionStoreWithUndo(
    (state) => [state.rpcEndpoint, state.keypairs, state.set]
  );
  const toast = useToast();

  const isValid = isValidPublicKey(pubkey);
  const isWallet = pubkey === walletPubkey?.toBase58();
  const hasPrivateKey = Object.keys(keypairs).includes(pubkey);

  const updateAccount = (fn: (state: WritableDraft<IAccount>) => void) => {
    update((state) => {
      fn(isAnchor ? state.anchorAccounts![index] : state.accounts.map[id]);
    });
  };

  const removeAccount = () => {
    update((state) => {
      // no need for the anchor side since it is never deleted
      removeFrom(state.accounts, id);
    });
    if (hasPrivateKey) {
      setSession((state) => {
        delete state.keypairs[pubkey];
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

  const nameWidth = useBreakpointValue({
    base: "100px",
    lg: "150px",
    xl: "200px",
  });

  return (
    <Flex mb="2" alignItems="center">
      <DragHandle
        unlockedProps={{ h: "2.5", w: "2.5" }}
        lockedProps={{ h: "3" }}
        locked={isAnchor}
      />

      <Numbering index={index} ml="2" minW="30px" fontSize="sm" />

      <EditableName
        ml="2"
        minW={nameWidth}
        maxW={nameWidth}
        textAlign="right"
        fontSize="sm"
        placeholder="Unnamed"
        tooltipProps={{ placement: "bottom-end" }}
        isDisabled={isAnchor}
        value={name}
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
          // TODO should be smarter based on the number of children in InputRightElement
          paddingEnd="14"
          value={pubkey}
          onChange={(e) => {
            updateAccount((state) => {
              state.pubkey = e.target.value.trim();
            });
          }}
        ></Input>
        <InputRightElement
          // chakra hardcode the width so we can't have multiple buttons
          w=""
          mr="1"
        >
          {isValid ? (
            <>
              {rpcEndpoint.network !== "mainnet-beta" && (
                <AirdropButton accountPubkey={pubkey} />
              )}
              <ExplorerButton
                size="xs"
                valueType="account"
                value={pubkey}
                rpcEndpoint={rpcEndpoint}
              />
            </>
          ) : (
            <>
              {programId && (
                <PdaButton
                  programId={programId}
                  setPubkey={(pubkey) => {
                    updateAccount((state) => {
                      state.pubkey = pubkey;
                    });
                  }}
                />
              )}
              {walletPubkey && (
                <Tooltip label="Use Wallet">
                  <IconButton
                    ml="1"
                    size="xs"
                    variant="ghost"
                    aria-label="Use Wallet"
                    icon={<Icon as={FaWallet} />}
                    onClick={() => {
                      updateAccount((state) => {
                        state.pubkey = walletPubkey?.toBase58();
                      });
                    }}
                  />
                </Tooltip>
              )}
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
        isDisabled={isAnchor}
        toggled={isWritable}
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
        isDisabled={isAnchor}
        toggled={isSigner}
        onToggle={(toggled) => {
          updateAccount((state) => {
            state.isSigner = toggled;
          });
        }}
      />

      {!isAnchor && (
        <Tooltip label="Remove">
          <IconButton
            ml="3"
            size="xs"
            aria-label="Remove"
            icon={<CloseIcon />}
            variant="ghost"
            onClick={removeAccount}
          />
        </Tooltip>
      )}
    </Flex>
  );
};
