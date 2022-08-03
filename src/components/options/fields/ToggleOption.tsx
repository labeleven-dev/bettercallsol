import { FormLabel, Switch } from "@chakra-ui/react";
import React from "react";

export const ToggleOption: React.FC<{
  id: string;
  name: string;
  get: () => boolean;
  set: (x: boolean) => void;
}> = ({ id, name, get, set }) => (
  <>
    <FormLabel htmlFor={id} textAlign="right">
      {name}
    </FormLabel>
    <Switch
      id={id}
      isChecked={get()}
      onChange={() => {
        set(!get());
      }}
    />
  </>
);
