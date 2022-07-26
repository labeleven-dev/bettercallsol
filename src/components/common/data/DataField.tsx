import { DeleteIcon, DragHandleIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Input, Select, Tooltip } from "@chakra-ui/react";
import { WritableDraft } from "immer/dist/internal";
import React, { useContext } from "react";
import { useInstruction } from "../../../hooks/useInstruction";
import { removeFrom, SortableCollection } from "../../../models/sortable";
import {
  DataFormat,
  IInstrctionDataField,
  InstructionDataFieldType,
} from "../../../models/web3";
import { Numbering } from "../Numbering";
import { SortableItemContext } from "../Sortable";
import { TruncatableEditable } from "../TruncatableEditable";

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

export const DataField: React.FC<{
  field: IInstrctionDataField;
  format: DataFormat;
  index: number;
}> = ({ field, format, index }) => {
  const { update } = useInstruction();
  const { listeners, attributes } = useContext(SortableItemContext);

  const updateField = (
    fn: (state: WritableDraft<IInstrctionDataField>) => void
  ) => {
    update((state) => {
      fn(
        (state.data[format] as SortableCollection<IInstrctionDataField>).map[
          field.id
        ]
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
        value={field.name}
        onChange={(value: string) => {
          updateField((state) => {
            state.name = value;
          });
        }}
      ></TruncatableEditable>

      <Select ml="2" w="150px" size="sm" placeholder="Field Type">
        {DATA_TYPES[format].map((type) => (
          <option value={type} key={type}>
            {type}
          </option>
        ))}
      </Select>

      <Input ml="2" flex="1" size="sm" placeholder="Field Value" />

      <Tooltip label="Remove">
        <IconButton
          ml="1"
          size="sm"
          aria-label="Remove"
          icon={<DeleteIcon />}
          variant="ghost"
          onClick={() => {
            update((state) => {
              removeFrom(
                state.data[format] as SortableCollection<IInstrctionDataField>,
                field.id
              );
            });
          }}
        />
      </Tooltip>
    </Flex>
  );
};
