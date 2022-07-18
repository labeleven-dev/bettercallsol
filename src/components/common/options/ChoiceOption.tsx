import { CheckIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  FormLabel,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import React from "react";

export const ChoiceOption: React.FC<{
  id: string;
  name: string;
  get: () => { id: string; name: string };
  getChoices: () => { id: string; name: string }[];
  set: (id: string) => void;
}> = ({ id, name, get, getChoices, set }) => (
  <>
    <FormLabel htmlFor={id} mt="2" textAlign="right">
      {name}
    </FormLabel>
    <Menu id={id}>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        {get().name}
      </MenuButton>
      <MenuList>
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
