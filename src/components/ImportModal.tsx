import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useImportFromUrl } from "../hooks/useImportFromUrl";

export const ImportModal: React.FC = () => {
  const { isLoading, status, cancel } = useImportFromUrl();

  return (
    <Modal
      size="sm"
      isCentered
      closeOnOverlayClick={false}
      // prevent "react-remove-scroll-bar: cannot calculate scrollbar size because it is removed (overflow:hidden on body)"
      blockScrollOnMount={false}
      isOpen={isLoading}
      onClose={cancel}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Importing Transaction...</ModalHeader>

        <ModalCloseButton />

        <ModalBody>
          <VStack mb="5">
            <Spinner mb="4" />
            <Text fontSize="sm" noOfLines={2}>
              {status}
            </Text>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
