import { AddIcon } from "@chakra-ui/icons";
import {
  Center,
  Grid,
  IconButton,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { WritableDraft } from "immer/dist/internal";
import React from "react";
import { useInstruction } from "../../../../hooks/useInstruction";
import { newDataField } from "../../../../models/internal-mappers";
import {
  DataFormat,
  IInstrctionDataField,
} from "../../../../models/internal-types";
import {
  addTo,
  SortableCollection,
  toSortedArray,
} from "../../../../models/sortable";
import { Sortable } from "../../../common/Sortable";
import { DataField } from "./DataField";

export const DataEditor: React.FC<{
  format: DataFormat;
  fields: SortableCollection<IInstrctionDataField>;
}> = ({ format, fields }) => {
  const {
    instruction: { dynamic },
    update,
  } = useInstruction();

  const updateFields = (
    fn: (state: WritableDraft<SortableCollection<IInstrctionDataField>>) => void
  ) => {
    update((state) => {
      fn(state.data[format] as SortableCollection<IInstrctionDataField>);
    });
  };

  const emptyBgColour = useColorModeValue("blackAlpha.100", "whiteAlpha.100");

  return (
    <Grid>
      {fields.order.length === 0 && (
        <Center p="3" bgColor={emptyBgColour} rounded="md">
          <Text as="i" fontSize="sm">
            No fields yet. Click on <AddIcon ml="0.5" mr="0.5" w="2.5" /> below
            to add a field.
          </Text>
        </Center>
      )}
      <Sortable
        itemOrder={fields.order}
        setItemOrder={(itemOrder) => {
          updateFields((state) => {
            state.order = itemOrder;
          });
        }}
      >
        {toSortedArray(fields).map((field, index) => (
          <DataField
            key={field.id}
            field={field}
            format={format}
            index={index}
          />
        ))}
      </Sortable>

      {dynamic && (
        <Tooltip label="Add Data">
          <IconButton
            mt="1"
            aria-label="Add Data"
            icon={<AddIcon />}
            variant="ghost"
            size="sm"
            onClick={() => {
              updateFields((state) => addTo(state, newDataField()));
            }}
          />
        </Tooltip>
      )}
    </Grid>
  );
};
