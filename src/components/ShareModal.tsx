import { CheckIcon, CopyIcon, DownloadIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  Box,
  Button,
  Center,
  Divider,
  Icon,
  Kbd,
  Link,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  UnorderedList,
  useClipboard,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { FaFileImport, FaGithub } from "react-icons/fa";
import {
  useSessionStoreWithoutUndo,
  useSessionStoreWithUndo,
} from "../hooks/useSessionStore";
import { mapITransactionToTransactionExt } from "../mappers/internal-to-external";

export const ShareModal: React.FC = () => {
  const [isOpen, set] = useSessionStoreWithoutUndo((state) => [
    state.uiState.shareOpen,
    state.set,
  ]);
  const transaction = useSessionStoreWithUndo((state) => state.transaction);
  const transactionJson = JSON.stringify(
    mapITransactionToTransactionExt(transaction)
  );

  const { hasCopied, onCopy } = useClipboard(transactionJson);
  const downloadUrl = useMemo(
    () =>
      URL.createObjectURL(
        new Blob([transactionJson], { type: "application/json" })
      ),
    [transactionJson]
  );

  return (
    <Modal
      size="lg"
      isOpen={isOpen}
      onClose={() => {
        set((state) => {
          state.uiState.shareOpen = false;
        });
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Share Transaction</ModalHeader>

        <ModalCloseButton />

        <ModalBody>
          <Center mb="2">
            <Tooltip label="Paste from clipboard when you get there!">
              <Button
                mr="2"
                as={Link}
                leftIcon={<FaGithub />}
                href="https://gist.github.com/"
                onClick={onCopy}
                isExternal
              >
                Copy &amp; Open New Gist
              </Button>
            </Tooltip>
          </Center>

          <Center mb="6">
            <Button
              mr="2"
              leftIcon={hasCopied ? <CheckIcon /> : <CopyIcon />}
              onClick={onCopy}
            >
              Copy to Clipboard
            </Button>
            <Button
              as="a"
              leftIcon={<DownloadIcon />}
              href={downloadUrl}
              download="transaction.json"
            >
              Download
            </Button>
          </Center>

          <Divider mb="6" />

          <Box mb="2">
            <Text mb="2" as="i">
              Tip: You can import a transaction using the{" "}
              <Icon as={FaFileImport} mr="0.5" /> Import button.
            </Text>
          </Box>
          <Box mb="4">
            <Text as="i">
              Better Call SOL also accepts the following URLs:
              <UnorderedList ml="8">
                <ListItem>
                  <Kbd>
                    {window.location.href}?share=&lt;URL to a share file&gt;
                  </Kbd>
                </ListItem>
                <ListItem>
                  <Kbd>
                    {window.location.href}?tx=&lt;Solana Transaction ID&gt;
                  </Kbd>
                </ListItem>
              </UnorderedList>
            </Text>
          </Box>
          <Alert status="info" variant="left-accent">
            <AlertDescription>More share options coming soon!</AlertDescription>
          </Alert>
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
