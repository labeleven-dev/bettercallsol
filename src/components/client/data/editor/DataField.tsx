import { CloseIcon } from "@chakra-ui/icons";
import {
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
  useBreakpointValue,
} from "@chakra-ui/react";
import React from "react";
import { useInstruction } from "../../../../hooks/useInstruction";
import { useInstrcutionDataField } from "../../../../hooks/useInstructionDataField";
import {
  DataFormat,
  IInstrctionDataField,
  InstructionDataFieldType,
} from "../../../../types/internal";
import { SortableCollection } from "../../../../types/sortable";
import { removeFrom } from "../../../../utils/sortable";
import {
  FORMAT_DATA_TYPES,
  NUMERICAL_DATA_TYPES,
} from "../../../../utils/ui-constants";
import { DragHandle } from "../../../common/DragHandle";
import { EditableName } from "../../../common/EditableName";
import { Numbering } from "../../../common/Numbering";

export const DataField: React.FC<{
  format: DataFormat;
  index: number;
}> = ({ format, index }) => {
  const { isAnchor, update: ixnUpdate } = useInstruction();
  const { id, useShallowGet, update } = useInstrcutionDataField(format);
  const [name, type, value] = useShallowGet((state) => [
    state.name,
    state.type,
    state.value,
  ]);

  return (
    <Flex mb="2" alignItems="center">
      <DragHandle
        unlockedProps={{ h: "2.5", w: "2.5" }}
        lockedProps={{ h: "3" }}
        locked={isAnchor}
      />

      <Numbering index={index} ml="2" minW="30px" fontSize="sm" />

      <EditableName
        ml="2"
        w={useBreakpointValue({
          base: "100px",
          lg: "150px",
          xl: "200px",
        })}
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

      <Select
        ml="2"
        w="120px"
        size="sm"
        fontFamily="mono"
        placeholder="Field Type"
        isDisabled={isAnchor}
        value={type}
        onChange={(e) => {
          update((state) => {
            state.type = e.target.value as InstructionDataFieldType;
          });
        }}
      >
        {FORMAT_DATA_TYPES[format].map((type) => (
          <option value={type} key={type}>
            {type}
          </option>
        ))}
      </Select>

      {NUMERICAL_DATA_TYPES.includes(type) ? (
        <NumberInput
          ml="2"
          size="sm"
          value={value}
          onChange={(_, value) => {
            update((state) => {
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
          ml="2"
          size="sm"
          value={value}
          onChange={() => {
            update((state) => {
              state.value = !value;
            });
          }}
        />
      ) : (
        <Input
          flex="1"
          ml="2"
          size="sm"
          fontFamily="mono"
          placeholder="Field Value"
          value={value}
          onChange={(e) => {
            update((state) => {
              state.value = e.target.value;
            });
          }}
        />
      )}

      {!isAnchor && (
        <Tooltip label="Remove">
          <IconButton
            ml="3"
            size="xs"
            aria-label="Remove"
            icon={<CloseIcon />}
            variant="ghost"
            onClick={() => {
              ixnUpdate((state) => {
                removeFrom(
                  state.data[
                    format
                  ] as SortableCollection<IInstrctionDataField>,
                  id
                );
              });
            }}
          />
        </Tooltip>
      )}
    </Flex>
  );
};
