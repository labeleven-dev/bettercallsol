import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
} from "@chakra-ui/react";
import { ImportTransaction } from "components/palette/ImportTransaction";
import React from "react";

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
