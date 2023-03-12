import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  ChakraProvider,
  Flex,
  Hide,
  Icon,
  Show,
} from "@chakra-ui/react";
import { Client } from "components/client/Client";
import { Web3Provider } from "components/common/Web3Provider";
import { Footer } from "components/Footer";
import { Header } from "components/header/Header";
import { ImportModal } from "components/ImportModal";
import { InfoModal } from "components/info/InfoModal";
import { Options } from "components/options/Options";
import { ShareModal } from "components/ShareModal";
import { useSessionStoreWithoutUndo } from "hooks/useSessionStore";
import React from "react";

import theme from "theme";

import "@solana/wallet-adapter-react-ui/styles.css";
import { ToggleIconButton } from "components/common/ToggleIconButton";
import { ImportPanel } from "components/import/ImportPanel";
import { FaFileImport } from "react-icons/fa";

export const App: React.FC = () => {
  const [sidePanel, setUI] = useSessionStoreWithoutUndo((state) => [
    state.uiState.sidePanel,
    state.set,
  ]);

  return (
    <ChakraProvider theme={theme}>
      <Web3Provider>
        <Flex flexDirection="column">
          {/* 
              header and footer fixed and span the entire page width
              Client and panels are independently scrollable
            */}

          <Box h="55px" w="full" position="fixed" zIndex="modal">
            <Header />
          </Box>

          <Show below="md">
            <Alert mt="55px" mb="-50px" status="warning" variant="left-accent">
              <AlertIcon />
              <AlertDescription>
                This tool has been optimised for desktop use. It may look wonky
                on mobile devices.
              </AlertDescription>
            </Alert>
          </Show>

          <Flex mt="80px" pb="10px" h="calc(100vh - 120px)">
            <Box flex="2" overflow="scroll" position="relative">
              <Client />
            </Box>

            {/* TODO overlaps with main pane on smaller width */}
            <Hide below="md">
              {sidePanel === "import" && (
                <Box flex="1" overflow="scroll">
                  <ImportPanel />
                </Box>
              )}
              <ToggleIconButton
                m="2"
                label="Import"
                icon={<Icon as={FaFileImport} />}
                toggled={sidePanel === "import"}
                onToggle={() => {
                  setUI((state) => {
                    state.uiState.sidePanel =
                      sidePanel === "import" ? "closed" : "import";
                  });
                }}
              />
            </Hide>
          </Flex>

          <Box position="fixed" bottom="0px" h="50px" w="full" zIndex="modal">
            <Footer />
          </Box>
        </Flex>

        <Options />
        <ImportModal />
        <ShareModal />
        <InfoModal />
      </Web3Provider>
    </ChakraProvider>
  );
};
