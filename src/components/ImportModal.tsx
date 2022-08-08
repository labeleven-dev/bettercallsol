import {
  Alert,
  AlertIcon,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { useImport } from "../hooks/useImport";
import {
  useSessionStoreWithoutUndo,
  useSessionStoreWithUndo,
} from "../hooks/useSessionStore";
import { mapIPreviewToITransaction } from "../models/preview-mappers";
import { DEFAULT_IMPORT } from "../models/state-default";
import { Preview } from "./palette/preview/Preview";

export const ImportModal: React.FC = () => {
  const [isLoading, transaction, setImport] = useSessionStoreWithoutUndo(
    (state) => [state.import.isLoading, state.import.transaction, state.set]
  );
  const setTransaction = useSessionStoreWithUndo((state) => state.set);

  useImport(); // reads the query params

  const onConfirm = () => {
    setTransaction((state) => {
      state.transaction = mapIPreviewToITransaction(transaction!);
    });
    onClose();
  };

  const onClose = () => {
    setImport((state) => {
      state.import = DEFAULT_IMPORT;
    });
  };

  return (
    <Modal
      size="lg"
      closeOnOverlayClick={false}
      isOpen={transaction !== undefined || isLoading}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Import Transaction</ModalHeader>

        <ModalCloseButton />

        <ModalBody>
          <Alert variant="left-accent" status="warning" mb="3">
            <AlertIcon />
            Only import and run transactions from trusted sources!
          </Alert>

          <Text mb="5">You are about to import the following transaction:</Text>

          {transaction === undefined ? (
            <Skeleton h="200px" />
          ) : (
            <Preview preview={transaction!} interactive={false} />
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="teal"
            mr="2"
            isDisabled={transaction === undefined}
            onClick={onConfirm}
          >
            Confirm
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
