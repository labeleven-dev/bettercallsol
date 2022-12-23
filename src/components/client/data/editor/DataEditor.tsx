import { AddIcon } from "@chakra-ui/icons";
import {
  Center,
  Grid,
  IconButton,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { DataField } from "components/client/data/editor/DataField";
import { Sortable } from "components/common/Sortable";
import { useInstruction } from "hooks/useInstruction";
import { WritableDraft } from "immer/dist/internal";
import React from "react";
import { DataFormat, IInstrctionDataField } from "types/internal";
import { IID, SortableCollection } from "types/sortable";
import { newDataField } from "utils/internal";
import { addTo } from "utils/sortable";

export const InstructionDataFieldContext = React.createContext<IID>("");

export const DataEditor: React.FC<{
  format: DataFormat;
}> = ({ format }) => {
  const { isAnchor, useGet, update } = useInstruction();
  const fieldOrder = useGet(
    (state) =>
      (format === "bufferLayout" ? state.data.bufferLayout : state.data.borsh)
        .order
  );

  const updateFields = (
    fn: (state: WritableDraft<SortableCollection<IInstrctionDataField>>) => void
  ) => {
    update((state) => {
      fn(state.data[format] as SortableCollection<IInstrctionDataField>);
    });
  };

  const emptyBgColour = useColorModeValue("blackAlpha.50", "whiteAlpha.50");

  return (
    <Grid>
      {fieldOrder.length === 0 && (
        <Center p="6" m="1" bgColor={emptyBgColour} rounded="md">
          <Text as="i" fontSize="sm" textColor="grey">
            No fields yet. Click on <AddIcon ml="0.5" mr="0.5" w="2.5" /> below
            to add one.
          </Text>
        </Center>
      )}
      <Sortable
        itemOrder={fieldOrder}
        setItemOrder={(itemOrder) => {
          updateFields((state) => {
            state.order = itemOrder;
          });
        }}
      >
        {fieldOrder.map((id, index) => (
          <InstructionDataFieldContext.Provider value={id} key={id}>
            <DataField format={format} index={index} />
          </InstructionDataFieldContext.Provider>
        ))}
      </Sortable>

      {!isAnchor && (
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
