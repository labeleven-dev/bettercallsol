import {
  IconButton,
  IconButtonProps,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

export const ToggleIconButton: React.FC<
  {
    icon: React.ReactElement;
    label: string;
    toggled?: boolean;
    onToggle?: (toggled: boolean) => void;
  } & Omit<IconButtonProps, "aria-label">
> = ({
  icon,
  label,
  toggled = false,
  onToggle,
  backgroundColor = useColorModeValue("main.200", "main.800"),
  ...theRest
}) => {
  return (
    <Tooltip label={label}>
      <IconButton
        aria-label={label}
        icon={icon}
        variant="ghost"
        backgroundColor={toggled ? backgroundColor : ""}
        _hover={{ borderWidth: "1px" }}
        onClick={() => {
          if (onToggle) onToggle(!toggled);
        }}
        {...theRest}
      />
    </Tooltip>
  );
};
