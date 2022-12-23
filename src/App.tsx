import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  ChakraProvider,
  Flex,
  Hide,
  Show,
} from "@chakra-ui/react";
import { Transaction } from "components/client/Transaction";
import { Web3Provider } from "components/common/Web3Provider";
import { Footer } from "components/Footer";
import { Header } from "components/header/Header";
import { ImportModal } from "components/ImportModal";
import { InfoModal } from "components/info/InfoModal";
import { Options } from "components/options/Options";
import { Palette } from "components/palette/Palette";
import { ShareModal } from "components/ShareModal";
import { useSessionStoreWithoutUndo } from "hooks/useSessionStore";
import React from "react";

import theme from "theme";

import "@solana/wallet-adapter-react-ui/styles.css";

export const App: React.FC = () => {
  const paletteOpen = useSessionStoreWithoutUndo(
    (state) => state.uiState.paletteOpen
  );

  return (
    <ChakraProvider theme={theme}>
      <Web3Provider>
        <Flex flexDirection="column">
          {/* 
              header and footer fixed and span the entire page width
              Transaction and palette are independently scrollable
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

          <Flex mt="45px" pb="10px" h="calc(100vh - 60px)">
            <Box flex="2" overflow="scroll">
              <Transaction />
            </Box>
            {paletteOpen && (
              // TODO overlaps with main pane on smaller width
              <Hide below="md">
                <Box flex="1" overflow="scroll">
                  <Palette />
                </Box>
              </Hide>
            )}
          </Flex>

          <Box position="fixed" bottom="0px" h="40px" w="full" zIndex="modal">
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
