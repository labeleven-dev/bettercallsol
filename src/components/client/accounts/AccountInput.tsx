import {
  Icon,
  IconButton,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import { FaMagic } from "react-icons/fa";
import { useAccount } from "../../../hooks/useAccount";
import { useAccountType } from "../../../hooks/useAccountType";
import { useSessionStoreWithUndo } from "../../../hooks/useSessionStore";
import { isValidPublicKey } from "../../../utils/web3js";
import { AccountAutoComplete } from "../../common/AccountAutoComplete";
import { ExplorerButton } from "../../common/ExplorerButton";
import { AccountTypeButton } from "./AccountTypeButton";
import { AirdropButton } from "./AirdropButton";

export const AccountInput: React.FC<{
  instructionIndex: number;
  index: number;
}> = ({ instructionIndex, index }) => {
  const { useGet, update } = useAccount();
  const rpcEndpoint = useSessionStoreWithUndo((state) => state.rpcEndpoint);
  const { type, populate, allPopulate } = useAccountType();

  const pubkey = useGet((state) => state.pubkey);

  return (
    <InputGroup
      id={`account-input-group-${instructionIndex}-${index}`}
      size="sm"
    >
      <InputLeftElement
        ml="1"
        // chakra hardcode the width so we can't have multiple buttons
        w=""
      >
        <AccountTypeButton />
      </InputLeftElement>

      <AccountAutoComplete
        chakraInputProps={{
          id: `account-${instructionIndex}-${index}`,
          size: "sm",
          paddingStart: "12",
          // TODO should be smarter based on the number of children in InputRightElement
          paddingEnd: "14",
          autoFocus: true,
          placeholder:
            type === "wallet"
              ? "Add connected wallet's public key"
              : type === "keypair"
              ? "Generate new keypair"
              : type === "pda"
              ? "Configure program ID and seeds to find program address"
              : type === "ata"
              ? "Configure mint to get token account associated with your wallet"
              : type === "program"
              ? "Start typing for well-known programs"
              : type === "sysvar"
              ? "Start typing for sysvars"
              : "Account public key",
        }}
        pubkey={pubkey}
        setPubkey={(pubkey) => {
          update((state) => {
            state.pubkey = pubkey.trim();
          });
        }}
        setAccountType={(type) => {
          update((state) => {
            state.type = type;
          });
          allPopulate[type.type]();
        }}
      />

      <InputRightElement
        // chakra hardcode the width so we can't have multiple buttons
        w=""
        mr="1"
      >
        {isValidPublicKey(pubkey) && (
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
        )}

        <Tooltip label="Auto-fill">
          <IconButton
            size="xs"
            variant="ghost"
            colorScheme="teal"
            aria-label="Auto-fill"
            icon={<Icon as={FaMagic} />}
            isDisabled={type === "unspecified"}
            onClick={() => {
              populate();
            }}
          />
        </Tooltip>
      </InputRightElement>
    </InputGroup>
  );
};
