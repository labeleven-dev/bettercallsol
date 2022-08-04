import { CheckIcon, CopyIcon, DownloadIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Divider,
  Kbd,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
  useClipboard,
} from "@chakra-ui/react";
import { useMemo } from "react";
import {
  useSessionStoreWithoutUndo,
  useSessionStoreWithUndo,
} from "../hooks/useSessionStore";
import { mapITransactionToTransactionExt } from "../models/external-mappers";

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
          <Text mb="3">
            You can copy your progress to the clipboard or download it as a JSON
            file:
          </Text>

          <Center mb="6">
            <Button
              mr="2"
              leftIcon={hasCopied ? <CheckIcon /> : <CopyIcon />}
              onClick={onCopy}
            >
              Copy
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

          <Text mb="2">These can be imported in a variety of ways:</Text>
          <UnorderedList ml="10" mb="4">
            <ListItem>
              Paste the file content in the <b>Import</b> sidebar &gt;{" "}
              <b>Share JSON</b>
            </ListItem>
            <ListItem>
              Store online, e.g. in a GitHub Gist, and then use the URL to raw
              content in the <b>Import</b> sidebar &gt; <b>Share URL</b>
            </ListItem>
          </UnorderedList>
          <Text as="i">
            Tip: You can share the URL with others:{" "}
            <Kbd>{window.location.href}?share=&lt;URL to your raw Gist&gt;</Kbd>
          </Text>
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
