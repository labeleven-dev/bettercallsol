import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

export const Palette: React.FC = () => {
  return (
    <Tabs
      minH="full"
      p="2"
      isFitted
      colorScheme="main"
      bgColor={useColorModeValue("blackAlpha.100", "blackAlpha.500")}
    >
      <TabList mb="1em">
        <Tab>History</Tab>
        <Tab>Import</Tab>
        <Tab>Examples</Tab>
      </TabList>
      <TabPanels>
        <TabPanel></TabPanel>
        <TabPanel></TabPanel>
        <TabPanel></TabPanel>
      </TabPanels>
    </Tabs>
  );
};
