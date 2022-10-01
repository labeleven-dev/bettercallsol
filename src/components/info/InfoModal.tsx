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
import { useShallowSessionStoreWithoutUndo } from "../../hooks/useSessionStore";
import { About } from "./About";
import { Acknowledgements } from "./Acknowledgements";
import { Help } from "./Help";
import { Privacy } from "./Privacy";

export const InfoModal: React.FC = () => {
  const [isOpen, set] = useShallowSessionStoreWithoutUndo((state) => [
    state.uiState.infoOpen,
    state.set,
  ]);
  return (
    <Modal
      // prevent "react-remove-scroll-bar: cannot calculate scrollbar size because it is removed (overflow:hidden on body)"
      blockScrollOnMount={false}
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
              <Tab>Privacy</Tab>
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
                <Privacy />
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
