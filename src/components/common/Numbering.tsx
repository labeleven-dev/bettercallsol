import { Badge, BadgeProps, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { useOptionsStore } from "../../hooks/useOptionsStore";

export const Numbering: React.FC<{ index: number } & BadgeProps> = ({
  index,
  ...theRest
}) => {
  const { enableNumbering } = useOptionsStore((state) => state.appOptions);
  const textColor = useColorModeValue("blackAlpha.500", "whiteAlpha.500");

  if (!enableNumbering) return null;

  return (
    <Badge
      variant="subtle"
      colorScheme="main"
      textColor={textColor}
      textAlign="center"
      rounded="xl"
      {...theRest}
    >
      {index + 1}
    </Badge>
  );
};
