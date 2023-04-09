import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Collapse,
  Divider,
  Flex,
  Grid,
  Heading,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";

export const ExpandableSection: React.FC<{
  heading: React.ReactNode;
  children: React.ReactNode;
}> = ({ heading, children }) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => {
    setExpanded((state) => !state);
  };

  return (
    <Grid mb="2" px="5" py="3">
      <Flex mt="2" mb="4" alignItems="center">
        <IconButton
          h="6"
          minW="6"
          mr="1"
          aria-label="Collapse"
          icon={
            expanded ? (
              <ChevronDownIcon h="4" w="4" />
            ) : (
              <ChevronRightIcon h="4" w="4" />
            )
          }
          variant="ghost"
          onClick={toggleExpand}
        />
        <Heading mr="3" size="sm" onClick={toggleExpand} cursor="pointer">
          {heading}
        </Heading>
        <Divider flex="1" />
      </Flex>

      <Collapse in={expanded} animate>
        {children}
      </Collapse>
    </Grid>
  );
};
