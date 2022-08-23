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
import React from "react";
import { FaPenNib } from "react-icons/fa";
import { useAccount } from "../../../hooks/useAccount";
import { useAccountType } from "../../../hooks/useAccountType";
import { useInstruction } from "../../../hooks/useInstruction";
import { useShallowSessionStoreWithUndo } from "../../../hooks/useSessionStore";
import { removeFrom } from "../../../utils/sortable";
import { DragHandle } from "../../common/DragHandle";
import { EditableName } from "../../common/EditableName";
import { Numbering } from "../../common/Numbering";
import { ToggleIconButton } from "../../common/ToggleIconButton";
import { AccountInput } from "./AccountInput";
import { PdaTypeConfig } from "./type-configs/PdaTypeConfig";

export const Account: React.FC<{
  index: number;
}> = ({ index }) => {
  const { id, isAnchor, useShallowGet, update } = useAccount();
  const { update: updateInstruction } = useInstruction();
  const { type, isConfigurable: isTypeConfigurable } = useAccountType();

  const [keypairs, setSession] = useShallowSessionStoreWithUndo((state) => [
    state.keypairs,
    state.set,
  ]);

  const [name, pubkey, isWritable, isSigner] = useShallowGet((state) => [
    state.name,
    state.pubkey,
    state.isWritable,
    state.isSigner,
  ]);

  const removeAccount = () => {
    updateInstruction((state) => {
      // no need for the anchor side since it is never deleted
      removeFrom(state.accounts, id as string);
    });
    if (Object.keys(keypairs).includes(pubkey)) {
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
          update((state) => {
            state.name = value;
          });
        }}
      />

      <Grid flex="1">
        <AccountInput />

        <Wrap
          // TODO ignores other future tags
          pt={isTypeConfigurable ? "1" : undefined}
        >
          {/* TODO */}
          {/* {type === "ata" && (
            <AtaTypeConfig />
          )} */}

          {type === "pda" && <PdaTypeConfig />}

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
          update((state) => {
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
          update((state) => {
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
