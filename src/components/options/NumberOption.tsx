import {
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import React from "react";

export const NumberOption: React.FC<{
  id: string;
  name: string;
  get: () => number;
  set: (x: number) => void;
  format?: (x: number) => any;
}> = ({ id, name, get, set, format }) => (
  <>
    <FormLabel htmlFor={id} mt="2" textAlign="right">
      {name}
    </FormLabel>
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
