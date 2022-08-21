import { CloseIcon, EditIcon } from "@chakra-ui/icons";
import {
  Flex,
  Grid,
  Icon,
  IconButton,
  Tooltip,
  useBreakpointValue,
  Wrap,
} from "@chakra-ui/react";
import { WritableDraft } from "immer/dist/internal";
import React from "react";
import { FaPenNib } from "react-icons/fa";
import { useAccountType } from "../../../hooks/useAccountType";
import { useInstruction } from "../../../hooks/useInstruction";
import { useSessionStoreWithUndo } from "../../../hooks/useSessionStore";
import { IAccount, IAccountTypeConfigPda } from "../../../types/internal";
import { removeFrom } from "../../../utils/sortable";
import { DragHandle } from "../../common/DragHandle";
import { EditableName } from "../../common/EditableName";
import { Numbering } from "../../common/Numbering";
import { ToggleIconButton } from "../../common/ToggleIconButton";
import { AccountInput } from "./AccountInput";
import { PdaTypeConfig } from "./type-configs/PdaTypeConfig";

export const Account: React.FC<{
  account: IAccount;
  index: number;
  isAnchor?: boolean;
}> = ({ account, index, isAnchor = false }) => {
  const {
    id,
    type: { type, config },
    name,
    pubkey,
    isWritable,
    isSigner,
  } = account;

  const { update } = useInstruction();
  const { isConfigurable: isTypeConfigurable } = useAccountType();

  const [keypairs, setSession] = useSessionStoreWithUndo((state) => [
    state.keypairs,
    state.set,
  ]);

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

  const nameWidth = useBreakpointValue({
    base: "100px",
    lg: "150px",
    xl: "200px",
  });

  return (
    <Flex mb="2" alignItems="start">
      <DragHandle
        unlockedProps={{ mt: "2", h: "2.5", w: "2.5" }}
        lockedProps={{ mt: "2", h: "3" }}
        locked={isAnchor}
      />

      <Numbering index={index} ml="2" minW="30px" fontSize="sm" />

      <EditableName
        mt="0.5"
        ml="2"
        mr="2"
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

      <Grid flex="1">
        <AccountInput account={account} />

        <Wrap
          // TODO ignores other future tags
          pt={isTypeConfigurable ? "1" : undefined}
        >
          {/* TODO */}
          {/* {type === "ata" && (
            <AtaTypeConfig config={config as IAccountTypeConfigAta} />
          )} */}

          {type === "pda" && (
            <PdaTypeConfig config={config as IAccountTypeConfigPda} />
          )}

          {/* TODO account balance */}
        </Wrap>

        {/* TODO description when not minimised */}
      </Grid>

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
            mt="1"
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
