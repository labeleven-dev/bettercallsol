import { CloseIcon, DragHandleIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  IconButton,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Switch,
  Tooltip,
} from "@chakra-ui/react";
import { WritableDraft } from "immer/dist/internal";
import React, { useContext } from "react";
import { useInstruction } from "../../../../hooks/useInstruction";
import { removeFrom, SortableCollection } from "../../../../models/sortable";
import {
  DataFormat,
  IInstrctionDataField,
  InstructionDataFieldType,
} from "../../../../models/web3";
import { Numbering } from "../../../common/Numbering";
import { SortableItemContext } from "../../../common/Sortable";
import { TruncatableEditable } from "../../../common/TruncatableEditable";

export const DataField: React.FC<{
  field: IInstrctionDataField;
  format: DataFormat;
  index: number;
}> = ({ field: { id, name, type, value }, format, index }) => {
  const { update } = useInstruction();
  const { listeners, attributes } = useContext(SortableItemContext);

  const updateField = (
    fn: (state: WritableDraft<IInstrctionDataField>) => void
  ) => {
    update((state) => {
      fn(
        (state.data[format] as SortableCollection<IInstrctionDataField>).map[id]
      );
    });
  };

  return (
    <Flex mb="2">
      <DragHandleIcon h="2.5" w="2.5" mt="3" {...attributes} {...listeners} />
      <Numbering index={index} ml="2" pt="2" minW="30px" fontSize="sm" />
      <TruncatableEditable
        ml="2"
        mt="1"
        w="100px"
        textAlign="right"
        fontSize="sm"
        value={name}
        onChange={(value: string) => {
          updateField((state) => {
            state.name = value;
          });
        }}
      ></TruncatableEditable>

      <Select
        ml="2"
        w="120px"
        size="sm"
        fontFamily="mono"
        placeholder="Field Type"
        value={type}
        onChange={(e) => {
          updateField((state) => {
            state.type = e.target.value as InstructionDataFieldType;
          });
        }}
      >
        {DATA_TYPES[format].map((type) => (
          <option value={type} key={type}>
            {type}
          </option>
        ))}
      </Select>

      <Box ml="2">
        {NUMERICAL_DATA_TYPES.includes(type) ? (
          <NumberInput
            size="sm"
            value={value}
            onChange={(_, value) => {
              updateField((state) => {
                state.value = value;
              });
            }}
          >
            <NumberInputField fontFamily="mono" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        ) : type === "bool" ? (
          <Switch
            mt="0.5"
            size="sm"
            value={value}
            onChange={() => {
              updateField((state) => {
                state.value = !value;
              });
            }}
          />
        ) : (
          <Input
            size="sm"
            fontFamily="mono"
            placeholder="Field Value"
            value={value}
            onChange={(e) => {
              updateField((state) => {
                state.value = e.target.value;
              });
            }}
          />
        )}
      </Box>

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
              removeFrom(
                state.data[format] as SortableCollection<IInstrctionDataField>,
                id
              );
            });
          }}
        />
      </Tooltip>
    </Flex>
  );
};

const DATA_TYPES: Record<DataFormat, InstructionDataFieldType[]> = {
  borsh: [
    "u8",
    "i8",
    "u16",
    "i16",
    "u32",
    "i32",
    "u64",
    "i64",
    "bool",
    "publicKey",
    "string",
  ],
  bufferLayout: [
    "u8",
    "i8",
    "u16",
    "i16",
    "u32",
    "i32",
    "u64",
    "i64",
    "bool",
    "publicKey",
    "string",
  ],
  raw: [],
};

const NUMERICAL_DATA_TYPES: InstructionDataFieldType[] = [
  "u8",
  "i8",
  "u16",
  "i16",
  "u32",
  "i32",
  "u64",
  "i64",
];
