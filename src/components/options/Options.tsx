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
import { GeneralOptions } from "components/options/GeneralOptions";
import { RpcEndpointOptions } from "components/options/RpcEndpointOptions";
import { TransactionOptions } from "components/options/TransactionOptions";
import { useConfigStore } from "hooks/useConfigStore";
import { useShallowSessionStoreWithoutUndo } from "hooks/useSessionStore";
import React from "react";
import {} from "types/state";
import { DEFAULT_APP_OPTIONS, DEFAUT_TRANSACTION_OPTIONS } from "utils/state";

export const Options: React.FC = () => {
  const [isOpen, setSession] = useShallowSessionStoreWithoutUndo((state) => [
    state.uiState.optionsOpen,
    state.set,
  ]);
  const setPersistent = useConfigStore((state) => state.set);

  if (!isOpen) return null;

  return (
    <Modal
      size="lg"
      // prevent "react-remove-scroll-bar: cannot calculate scrollbar size because it is removed (overflow:hidden on body)"
      blockScrollOnMount={false}
      isOpen={true}
      onClose={() => {
        setSession((state) => {
          state.uiState.optionsOpen = false;
        });
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Options</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Tabs isFitted isLazy>
            <TabList mb="1em">
              <Tab>General</Tab>
              <Tab>RPC Endpoints</Tab>
              <Tab>Transaction</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <GeneralOptions />
              </TabPanel>
              <TabPanel>
                <RpcEndpointOptions />
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
              setPersistent((state) => {
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
