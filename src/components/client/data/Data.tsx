import {
  Divider,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  TabProps,
  Tabs,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { useInstruction } from "../../../hooks/useInstruction";
import { IInstructionData } from "../../../models/internal-types";
import { DataEditor } from "./editor/DataEditor";
import { RawData } from "./RawData";

export const Data: React.FC<{ data: IInstructionData }> = ({
  data: { format, raw, borsh, bufferLayout },
}) => {
  const { update } = useInstruction();

  const tabStyle: TabProps = {
    mr: "1",
    fontWeight: "semibold",
    color: useColorModeValue("blackAlpha.600", "whiteAlpha.600"),
    borderWidth: "1px",
    borderColor: "transparent",
    _selected: {
      color: "chakra-body-text",
      background: useColorModeValue("main.200", "main.800"),
    },
    _hover: {
      borderColor: "chakra-border-color",
    },
  };

  return (
    <>
      <Flex mt="2" mb="4" alignItems="center">
        <Heading mr="3" size="sm">
          Data
        </Heading>
        <Divider flex="1" />
      </Flex>

      <Tabs
        variant="unstyled"
        size="sm"
        isLazy
        colorScheme="main"
        index={format === "borsh" ? 0 : format === "bufferLayout" ? 1 : 2}
        onChange={(index) => {
          update((state) => {
            state.data.format =
              index === 0 ? "borsh" : index === 1 ? "bufferLayout" : "raw";
          });
        }}
      >
        <TabList>
          <Tab {...tabStyle} rounded="md">
            Borsh
          </Tab>
          <Tab {...tabStyle} rounded="md">
            Buffer Layout
          </Tab>
          <Tab {...tabStyle} rounded="md">
            Raw
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel p="0" pt="3">
            <DataEditor format="borsh" fields={borsh} />
          </TabPanel>
          <TabPanel p="0" pt="3">
            <DataEditor format="bufferLayout" fields={bufferLayout} />
          </TabPanel>
          <TabPanel p="0" pt="3">
            <RawData data={raw} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};
