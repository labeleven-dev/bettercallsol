import { Badge, Flex, InputProps, Spacer, Text } from "@chakra-ui/react";
import { Autocomplete, AutoCompleteItem } from "components/common/AutoComplete";
import { useSessionStoreWithUndo } from "hooks/useSessionStore";
import { WritableDraft } from "immer/dist/internal";
import { NATIVE_INSTRUCTIONS } from "library/instructions/native";
import { SPL_INSTRUCTIONS } from "library/instructions/spl";
import { LOADER_IDS, programLabel, PROGRAM_INFO_BY_ID } from "library/programs";
import { SYSVARS_BY_ID } from "library/sysvars";
import { mapIInstructionExtToIInstruction } from "mappers/external-to-internal";
import React, { useMemo, useState } from "react";
import { useFilter } from "react-aria";
import { AccountType, IAccount, INetwork, IPubKey } from "types/internal";
import { IID } from "types/sortable";
import { ALL_NETWORKS } from "utils/internal";

type OptionType = "input" | "type" | "program" | "sysvar" | "instruction";

interface Option {
  label: string;
  secondaryLabel?: string;
  value: string;
  type: OptionType;
  available?: INetwork[];
}

// TODO needs to be refactored to handle program ID auto-complete
// TODO can we cache the autocomplete items, rather than creating them for each component?

/**
 * Action box for accounts
 */
export const AccountAutoComplete: React.FC<{
  types: OptionType[];
  pubkey: IPubKey;
  setPubkey: (pubkey: IPubKey) => void;
  updateAccount?: (fn: (state: WritableDraft<IAccount>) => void) => void;
  updateInstructionWithId?: IID;
  chakraInputProps?: InputProps;
}> = ({
  pubkey,
  setPubkey,
  updateAccount,
  updateInstructionWithId,
  types,
  chakraInputProps,
}) => {
  const availableOptions = useMemo(
    () => OPTIONS.filter((option) => types.includes(option.type)),
    []
  );
  const [options, setOptions] = useState<Option[]>(availableOptions);
  const [selectedKey, setSelectedKey] = useState<React.Key | null>(null);

  let { contains, startsWith } = useFilter({ sensitivity: "base" });
  const [network, setTransaction] = useSessionStoreWithUndo((state) => [
    state.rpcEndpoint.network,
    state.set,
  ]);

  const onInputChange = (v: string) => {
    setPubkey(v);

    // TODO check network
    const matching = availableOptions.filter(
      ({ label, secondaryLabel = "" }) =>
        contains(label, v) || startsWith(secondaryLabel, v)
    );
    setOptions(
      matching.length > 0
        ? matching
        : [
            {
              label: v,
              value: v,
              type: "input",
            },
          ]
    );
  };

  const onSelectionChange = (key: React.Key) => {
    setSelectedKey(key);
    if (!key) {
      return;
    }

    const [type, value] = (key as string).split("-");

    if (type === "input") {
      setPubkey(value);
    } else if (type === "type") {
      setPubkey("");
      if (updateAccount) {
        updateAccount((state) => {
          state.type = value as AccountType;
        });
      }
    } else if (type === "program") {
      setPubkey(value);
      if (updateAccount) {
        updateAccount((state) => {
          state.type = "program";
          state.metadata = { name: programLabel(value, network) };
        });
      }
    } else if (type === "sysvar") {
      setPubkey(value);
      if (updateAccount) {
        updateAccount((state) => {
          state.type = "sysvar";
          state.metadata = {
            name: SYSVARS_BY_ID[value].name,
          };
        });
      }
    } else if (type == "instruction") {
      setPubkey("");
      if (updateInstructionWithId) {
        const library = value.startsWith("SPL.")
          ? SPL_INSTRUCTIONS
          : NATIVE_INSTRUCTIONS;
        setTransaction((state) => {
          state.transaction.instructions.map[updateInstructionWithId] =
            mapIInstructionExtToIInstruction(library[value].instruction);
        });
      }
    }
  };

  return (
    <Autocomplete
      label="Account"
      items={options}
      allowsCustomValue
      chakraInputProps={{ fontFamily: "mono", ...chakraInputProps }}
      inputValue={pubkey}
      selectedKey={selectedKey}
      onInputChange={onInputChange}
      onSelectionChange={onSelectionChange}
    >
      {({ type, label, secondaryLabel = "", value }: Option) => (
        <AutoCompleteItem key={`${type}-${value}`} textValue={label}>
          <Flex w="100%" fontSize="sm">
            <Badge
              mr="1"
              maxH="4" // otherwise it streches when the rest wrap
              colorScheme={
                type === "type"
                  ? "green"
                  : type === "program"
                  ? "purple"
                  : type === "sysvar"
                  ? "blue"
                  : type === "instruction"
                  ? "pink"
                  : type === "input"
                  ? "orange"
                  : undefined
              }
            >
              {type}
            </Badge>
            <Text>{label}</Text>
            <Spacer />
            <Text fontSize="xs" opacity="0.6" fontFamily="mono">
              {secondaryLabel}
            </Text>
          </Flex>
        </AutoCompleteItem>
      )}
    </Autocomplete>
  );
};

const OPTIONS: Option[] = [
  {
    label: "Wallet",
    value: "wallet",
    type: "type",
  },
  {
    label: "New keypair",
    value: "keypair",
    type: "type",
  },
  {
    label: "Program-derived address (PDA)",
    value: "pda",
    type: "type",
  },
  {
    label: "Associated token account (ATA)",
    value: "ata",
    type: "type",
  },
  {
    label: "Program",
    value: "program",
    type: "type",
  },
  {
    label: "Sysvar",
    value: "sysvar",
    type: "type",
  },
]
  .concat(
    Object.entries({ ...NATIVE_INSTRUCTIONS, ...SPL_INSTRUCTIONS }).map(
      ([id, { program, instruction }]) => ({
        label: instruction.name,
        secondaryLabel: program,
        value: id,
        type: "instruction",
        available: ALL_NETWORKS,
      })
    )
  )
  .concat(
    Object.entries(PROGRAM_INFO_BY_ID).map(
      ([address, { name, deployments }]) => ({
        label: name,
        secondaryLabel: address,
        value: address,
        type: "program",
        available: deployments,
      })
    )
  )
  .concat(
    Object.entries(LOADER_IDS)
      .map(([address, name]) => ({
        label: name,
        secondaryLabel: address,
        value: address,
        type: "program",
        available: ALL_NETWORKS,
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  )
  .concat(
    Object.entries(SYSVARS_BY_ID)
      .map(([address, { name }]) => ({
        label: name,
        secondaryLabel: address,
        value: address,
        type: "sysvar",
        available: ALL_NETWORKS,
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  ) as Option[];
