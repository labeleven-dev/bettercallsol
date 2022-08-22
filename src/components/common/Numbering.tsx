import { Badge, BadgeProps, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { usePersistentStore } from "../../hooks/usePersistentStore";

export const Numbering: React.FC<{ index: number } & BadgeProps> = ({
  index,
  ...theRest
}) => {
  const enableNumbering = usePersistentStore(
    (state) => state.appOptions.enableNumbering
  );
  const textColor = useColorModeValue("blackAlpha.500", "whiteAlpha.500");

  if (!enableNumbering) return null;

  return (
    <Badge
      variant="subtle"
      colorScheme="main"
      textColor={textColor}
      textAlign="center"
      p="0.5"
      rounded="xl"
      {...theRest}
    >
      {index + 1}
    </Badge>
  );
};
