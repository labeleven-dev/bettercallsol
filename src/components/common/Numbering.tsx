import { Heading, HeadingProps, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { useOptionsStore } from "../../hooks/useOptionsStore";

export const Numbering: React.FC<{ index: number } & HeadingProps> = ({
  index,
  ...theRest
}) => {
  const { enableNumbering } = useOptionsStore((state) => state.appOptions);
  const textColor = useColorModeValue("blackAlpha.500", "whiteAlpha.500");

  if (!enableNumbering) return null;

  return (
    <Heading {...theRest} textColor={textColor}>
      #{index + 1}
    </Heading>
  );
};
