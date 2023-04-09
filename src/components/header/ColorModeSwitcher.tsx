import {
  Icon,
  IconButtonProps,
  MenuItem,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import { FaMoon, FaSun } from "react-icons/fa";

type ColorModeSwitcherProps = Omit<IconButtonProps, "aria-label">;

export const ColorModeSwitcher: React.FC<ColorModeSwitcherProps> = (props) => {
  const { toggleColorMode } = useColorMode();
  const text = `${useColorModeValue("Dark", "Light")} mode`;
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);

  return (
    <MenuItem icon={<Icon as={SwitchIcon} />} onClick={toggleColorMode}>
      {text}
    </MenuItem>
  );
};
