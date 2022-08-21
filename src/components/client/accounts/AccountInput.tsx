import {
  Icon,
  IconButton,
  Input,
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
import { IAccount } from "../../../types/internal";
import { isValidPublicKey } from "../../../utils/web3js";
import { ExplorerButton } from "../../common/ExplorerButton";
import { AccountTypeButton } from "./AccountTypeButton";
import { AirdropButton } from "./AirdropButton";

export const AccountInput: React.FC<{
  account: IAccount;
}> = ({ account: { pubkey, type } }) => {
  const { update } = useAccount();
  const rpcEndpoint = useSessionStoreWithUndo((state) => state.rpcEndpoint);
  const { populate } = useAccountType();

  const isValid = isValidPublicKey(pubkey);

  return (
    <InputGroup size="sm">
      <InputLeftElement
        ml="1"
        // chakra hardcode the width so we can't have multiple buttons
        w=""
      >
        <AccountTypeButton type={type} />
      </InputLeftElement>

      <Input
        fontFamily="mono"
        placeholder={
          type?.type === "wallet"
            ? "Add connected wallet's public key"
            : type.type === "keypair"
            ? "Generate new keypair"
            : type.type === "pda"
            ? "Configure program ID and seeds to find program address"
            : type.type === "ata"
            ? "Configure mint to get token account associated with your wallet"
            : type.type === "program"
            ? "Start typing for well-known programs"
            : type.type === "sysvar"
            ? "Start typing for sysvars"
            : "Account public key"
        }
        paddingStart="12"
        // TODO should be smarter based on the number of children in InputRightElement
        paddingEnd="14"
        value={pubkey}
        onChange={(e) => {
          update((state) => {
            state.pubkey = e.target.value.trim();
          });
        }}
      ></Input>

      <InputRightElement
        // chakra hardcode the width so we can't have multiple buttons
        w=""
        mr="1"
      >
        {isValid && (
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
            isDisabled={type.type === "unspecified"}
            onClick={() => {
              populate();
            }}
          />
        </Tooltip>
      </InputRightElement>
    </InputGroup>
  );
};
