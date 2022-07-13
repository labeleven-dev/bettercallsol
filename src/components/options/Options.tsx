import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import React from "react";
import { useTransactionStore } from "../../hooks/useTransactionStore";
import { GeneralOptions } from "./GeneralOptions";
import { TransactionOptions } from "./TransactionOptions";

export const Options: React.FC = () => {
  const isOpen = useTransactionStore((state) => state.optionsOpen);
  const set = useTransactionStore((state) => state.set);

  const options = [];

  return (
    <Modal
      size="xl"
      isOpen={isOpen}
      onClose={() => {
        set((state) => {
          state.optionsOpen = false;
        });
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Options</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Tabs isFitted>
            <TabList mb="1em">
              <Tab>General</Tab>
              <Tab>Transaction</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <GeneralOptions />
              </TabPanel>
              <TabPanel>
                <TransactionOptions />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost">Reset Settings</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
