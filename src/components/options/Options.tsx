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
import { DEFAULT_APP_OPTIONS, DEFAUT_TRANSACTION_OPTIONS } from "../../state";
import { GeneralOptions } from "./GeneralOptions";
import { TransactionOptions } from "./TransactionOptions";

export const Options: React.FC = () => {
  const isOpen = useTransactionStore((state) => state.optionsOpen);
  const set = useTransactionStore((state) => state.set);

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
          <Button
            colorScheme="gray"
            onClick={() => {
              set((state) => {
                state.appOptions = DEFAULT_APP_OPTIONS;
                state.transactionOptions = DEFAUT_TRANSACTION_OPTIONS;
              });
            }}
          >
            Reset Settings
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
