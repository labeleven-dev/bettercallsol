import { CloseIcon } from "@chakra-ui/icons";
import {
  Flex,
  Grid,
  Icon,
  IconButton,
  Tag,
  Tooltip,
  useBreakpointValue,
  Wrap,
} from "@chakra-ui/react";
import { AccountInput } from "components/client/accounts/AccountInput";
import { AtaTypeConfig } from "components/client/accounts/type-configs/AtaTypeConfig";
import { PdaTypeConfig } from "components/client/accounts/type-configs/PdaTypeConfig";
import { Description } from "components/common/Description";
import { DragHandle } from "components/common/DragHandle";
import { EditableName } from "components/common/EditableName";
import { Numbering } from "components/common/Numbering";
import { ToggleIconButton } from "components/common/ToggleIconButton";
import { useAccount } from "hooks/useAccount";
import { useAccountType } from "hooks/useAccountType";
import { useInstruction } from "hooks/useInstruction";
import { useShallowSessionStoreWithUndo } from "hooks/useSessionStore";
import React from "react";
import { FaFeather, FaICursor } from "react-icons/fa";
import { removeFrom } from "utils/sortable";

export const Account: React.FC<{
  index: number;
}> = ({ index }) => {
  const { id, isAnchor, useShallowGet, update } = useAccount();
  const { update: updateInstruction } = useInstruction();
  const {
    type,
    metadata,
    isConfigurable: isTypeConfigurable,
  } = useAccountType();

  const [keypairs, setSession] = useShallowSessionStoreWithUndo((state) => [
    state.keypairs,
    state.set,
  ]);

  const [name, description, pubkey, isWritable, isSigner] = useShallowGet(
    (state) => [
      state.name,
      state.description,
      state.pubkey,
      state.isWritable,
      state.isSigner,
    ]
  );

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
    <Flex mb="1" alignItems="start">
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
        <Flex>
          <Grid flex="1">
            <AccountInput />

            <Wrap
              // TODO ignores other future tags
              pt={isTypeConfigurable || metadata?.name ? "1" : undefined}
            >
              {type === "ata" && <AtaTypeConfig />}
              {type === "pda" && <PdaTypeConfig />}
              {metadata?.name && <Tag size="sm">{metadata.name}</Tag>}

              {/* TODO account balance */}
            </Wrap>
          </Grid>

          <ToggleIconButton
            ml="1"
            size="sm"
            label="Writable"
            icon={<Icon as={FaICursor} />}
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
            icon={<Icon as={FaFeather} />}
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

        <Description
          mt="1"
          fontSize="sm"
          description={description}
          setDescription={(description) => {
            update((state) => (state.description = description));
          }}
        />
      </Grid>
    </Flex>
  );
};
