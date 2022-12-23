import { CheckIcon, CopyIcon, DownloadIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Kbd,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useClipboard,
} from "@chakra-ui/react";
import { CopyButton } from "components/common/CopyButton";
import {
  useShallowSessionStoreWithoutUndo,
  useShallowSessionStoreWithUndo,
} from "hooks/useSessionStore";
import { mapITransactionExtToProtobuf } from "mappers/external-to-protobuf";
import { mapITransactionToTransactionExt } from "mappers/internal-to-external";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";

export const ShareModal: React.FC = () => {
  const [isOpen, set] = useShallowSessionStoreWithoutUndo((state) => [
    state.uiState.shareOpen,
    state.set,
  ]);
  const [transaction, rpcEndpoint] = useShallowSessionStoreWithUndo((state) => [
    state.transaction,
    state.rpcEndpoint,
  ]);

  const [externalJson, setExternalJson] = useState("");
  const [encodedUrl, setEncodedUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [annotate, setAnnotate] = useState(false);

  const { hasCopied, onCopy } = useClipboard(externalJson);

  useEffect(() => {
    if (!isOpen) return;

    const external = mapITransactionToTransactionExt(transaction, rpcEndpoint);

    // encode transaction
    const encoded = mapITransactionExtToProtobuf(external);
    setEncodedUrl(
      `${window.location.href}?${annotate ? "annotate&" : ""}share=${encoded}`
    );

    // create download URL
    setExternalJson(JSON.stringify(external));
    setDownloadUrl(
      URL.createObjectURL(
        new Blob([externalJson], { type: "application/json" })
      )
    );
  }, [isOpen, transaction, rpcEndpoint, annotate, externalJson]);

  return (
    <Modal
      size="xl"
      // prevent "react-remove-scroll-bar: cannot calculate scrollbar size because it is removed (overflow:hidden on body)"
      blockScrollOnMount={false}
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
            Send your friends and family Better Call Sol transcations.
          </Text>

          {/* TODO remove when out of beta */}
          <Alert mb="3" fontSize="sm" status="warning" variant="left-accent">
            <AlertIcon />
            <AlertDescription>
              We'll try our best but during the Alpha, we may not be able to
              guarantee backward compatibility.
            </AlertDescription>
          </Alert>

          <Tabs variant="enclosed">
            <TabList>
              <Tab>URL</Tab>
              <Tab>JSON</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Flex>
                  <Input
                    flex="1"
                    fontFamily="mono"
                    isReadOnly
                    onFocus={(e) => {
                      e.target.select();
                    }}
                    value={encodedUrl}
                  />
                  <CopyButton ml="1" size="md" value={encodedUrl} />
                </Flex>

                <FormControl mt="2" display="flex" alignItems="center">
                  <Switch
                    id="expand-annotations"
                    isChecked={annotate}
                    onChange={() => {
                      setAnnotate(!annotate);
                    }}
                  />
                  <FormLabel htmlFor="expand-annotations" ml="1" mb="0">
                    Expand annotations on load
                  </FormLabel>
                </FormControl>
              </TabPanel>

              <TabPanel>
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
                <Center>
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
                    download={`${transaction.name || "transaction"}.json`}
                  >
                    Download
                  </Button>
                </Center>

                <Alert mt="8" fontSize="md" status="info" variant="top-accent">
                  <AlertDescription>
                    You can point to a URL containing the JSON:{" "}
                    <Kbd>{window.location.href}?shareJson=&lt; URL &gt;</Kbd>
                    <br />
                    E.g.
                    <br />
                    <Kbd overflowWrap="anywhere">
                      {window.location.href}
                      <br />
                      ?shareJson=https://gist.githubusercontent.com/...
                    </Kbd>
                  </AlertDescription>
                </Alert>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
