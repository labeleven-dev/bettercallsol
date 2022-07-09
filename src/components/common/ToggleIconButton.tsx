import { IconButton, Tooltip, useColorModeValue } from "@chakra-ui/react";
import React, { useState } from "react";

export const ToggleIconButton: React.FC<{
  icon: React.ReactElement;
  label: string;
  initialToggled?: boolean;
  onToggled?: (toggled: boolean) => void;
  [x: string]: any;
}> = ({ icon, label, initialToggled = false, onToggled, ...theRest }) => {
  const [toggled, setToggled] = useState(initialToggled);
  const bgColour = useColorModeValue("main.200", "main.800");

  return (
    <Tooltip label={label}>
      <IconButton
        aria-label={label}
        icon={icon}
        variant="ghost"
        backgroundColor={toggled ? bgColour : ""}
        onClick={() => {
          if (onToggled) onToggled(!toggled);
          setToggled(!toggled);
        }}
        {...theRest}
      />
    </Tooltip>
  );
};
