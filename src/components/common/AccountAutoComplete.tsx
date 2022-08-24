import { Badge, Flex, InputProps, Spacer, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useFilter } from "react-aria";
import { useSessionStoreWithUndo } from "../../hooks/useSessionStore";
import {
  LOADER_IDS,
  programLabel,
  PROGRAM_INFO_BY_ID,
} from "../../library/programs";
import { SYSVARS_BY_ID } from "../../library/sysvars";
import {
  AccountTypeType,
  IAccountType,
  INetwork,
  IPubKey,
} from "../../types/internal";
import { ALL_NETWORKS } from "../../utils/internal";
import { Autocomplete, AutoCompleteItem } from "./AutoComplete";

type OptionType = "input" | "type" | "program" | "sysvar";

interface Option {
  label: string;
  secondaryLabel?: string;
  value: string;
  type: OptionType;
  available?: INetwork[];
}

// TODO needs to be refactored to handle program ID auto-complete

/**
 * Action box for accounts
 */
export const AccountAutoComplete: React.FC<{
  pubkey: IPubKey;
  setPubkey: (pubkey: IPubKey) => void;
  setAccountType?: (type: IAccountType) => void;
  types?: OptionType[];
  chakraInputProps?: InputProps;
}> = ({ pubkey, setPubkey, setAccountType, types, chakraInputProps }) => {
  const [options, setOptions] = useState(OPTIONS);
  const [selectedKey, setSelectedKey] = useState<React.Key | null>(null);

  let { contains, startsWith } = useFilter({ sensitivity: "base" });
  const network = useSessionStoreWithUndo((state) => state.rpcEndpoint.network);

  const onInputChange = (v: string) => {
    setPubkey(v);

    // TODO check network
    const matching = OPTIONS.filter(
      ({ type, label, secondaryLabel = "" }) =>
        (!types || types.includes(type)) &&
        (contains(label, v) || startsWith(secondaryLabel, v))
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
      if (setAccountType) {
        setAccountType({ type: value as AccountTypeType });
      }
    } else if (type === "program") {
      setPubkey(value);
      if (setAccountType) {
        setAccountType({
          type: "program",
          config: {
            name: programLabel(value, network),
          },
        });
      }
    } else if (type === "sysvar") {
      setPubkey(value);
      if (setAccountType) {
        setAccountType({
          type: "sysvar",
          config: {
            name: SYSVARS_BY_ID[value].name,
          },
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
                  : type === "input"
                  ? "orange"
                  : undefined
              }
            >
              {type}
            </Badge>
            <Text>{label}</Text>
            <Spacer />
            <Text fontSize="xs" color="gray.500" fontFamily="mono">
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
  // TODO implement
  // {
  //   label: "Associated token account",
  //   value: "ata",
  //   type: "type",
  // },
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
    Object.entries(PROGRAM_INFO_BY_ID)
      .map(([address, { name, deployments }]) => ({
        label: name,
        secondaryLabel: address,
        value: address,
        type: "program",
        available: deployments,
      }))
      .concat(
        Object.entries(LOADER_IDS).map(([address, name]) => ({
          label: name,
          secondaryLabel: address,
          value: address,
          type: "program",
          available: ALL_NETWORKS,
        }))
      )
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
