import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useSessionStoreWithoutUndo } from "../../hooks/useSessionStore";
import { About } from "./About";
import { Acknowledgements } from "./Acknowledgements";
import { Help } from "./Help";

export const InfoModal: React.FC = () => {
  const [isOpen, set] = useSessionStoreWithoutUndo((state) => [
    state.uiState.infoOpen,
    state.set,
  ]);
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        set((state) => {
          state.uiState.infoOpen = false;
        });
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Info</ModalHeader>

        <ModalCloseButton />

        <ModalBody>
          <Tabs isFitted>
            <TabList>
              <Tab>Help</Tab>
              <Tab>About</Tab>
              <Tab>Acknowledgements</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Help />
              </TabPanel>
              <TabPanel>
                <About />
              </TabPanel>

              <TabPanel>
                <Acknowledgements />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
