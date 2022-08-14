import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { ImportTransaction } from "./ImportTransaction";

export const Palette: React.FC = () => {
  return (
    <Tabs
      minH="full"
      p="2"
      isFitted
      colorScheme="main"
      bgColor={useColorModeValue("gray.50", "blackAlpha.500")}
    >
      <TabList mb="1em">
        {/* <Tab>History</Tab>
        <Tab>Library</Tab> */}
        <Tab>Import</Tab>
      </TabList>
      <TabPanels>
        {/* <TabPanel></TabPanel>
        <TabPanel></TabPanel> */}
        <TabPanel>
          <ImportTransaction />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
