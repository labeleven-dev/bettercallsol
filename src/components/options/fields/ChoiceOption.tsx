import { CheckIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  FormLabel,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";

export const ChoiceOption: React.FC<{
  id: string;
  name: string;
  moreInfo?: string;
  get: () => { id: string; name: string };
  getChoices: () => { id: string; name: string }[];
  set: (id: string) => void;
}> = ({ id, name, moreInfo, get, getChoices, set }) => (
  <>
    <Tooltip label={moreInfo} placement="bottom-end">
      <FormLabel htmlFor={id} textAlign="right">
        {name}
      </FormLabel>
    </Tooltip>
    <Menu id={id} matchWidth={true}>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        {get().name}
      </MenuButton>
      <MenuList zIndex="modal">
        {getChoices().map(({ id, name }) => (
          <MenuItem
            icon={get().id === id ? <CheckIcon /> : undefined}
            onClick={() => {
              set(id);
            }}
            key={name}
          >
            {name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  </>
);
