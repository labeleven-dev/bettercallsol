import {
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";

export const NumberOption: React.FC<{
  id: string;
  name: string;
  moreInfo?: string;
  get: () => number;
  set: (x: number) => void;
  format?: (x: number) => any;
}> = ({ id, name, moreInfo, get, set, format }) => (
  <>
    <Tooltip label={moreInfo} placement="bottom-end">
      <FormLabel htmlFor={id} textAlign="right">
        {name}
      </FormLabel>
    </Tooltip>
    <NumberInput
      id={id}
      min={1}
      value={format ? format(get()) : get()}
      onChange={(_, valueAsNumber) => {
        set(valueAsNumber);
      }}
    >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  </>
);
