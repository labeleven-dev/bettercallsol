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
> = ({ icon, label, toggled = false, onToggle, ...theRest }) => {
  const bgColour = useColorModeValue("main.200", "main.800");

  return (
    <Tooltip label={label}>
      <IconButton
        aria-label={label}
        icon={icon}
        variant="ghost"
        backgroundColor={toggled ? bgColour : ""}
        _hover={{ borderWidth: "1px" }}
        onClick={() => {
          if (onToggle) onToggle(!toggled);
        }}
        {...theRest}
      />
    </Tooltip>
  );
};
