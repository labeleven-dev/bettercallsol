import { FormLabel, Switch, Tooltip } from "@chakra-ui/react";
import React from "react";

export const ToggleOption: React.FC<{
  id: string;
  name: string;
  moreInfo?: string;
  get: () => boolean;
  set: (x: boolean) => void;
}> = ({ id, name, moreInfo, get, set }) => (
  <>
    <Tooltip label={moreInfo} placement="bottom-end">
      <FormLabel htmlFor={id} textAlign="right">
        {name}
      </FormLabel>
    </Tooltip>
    <Switch
      id={id}
      isChecked={get()}
      onChange={() => {
        set(!get());
      }}
    />
  </>
);
