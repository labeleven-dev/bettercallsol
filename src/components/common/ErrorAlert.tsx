import {
  Alert,
  AlertDescription,
  AlertIcon,
  CloseButton,
} from "@chakra-ui/react";
import React from "react";

export const ErrorAlert: React.FC<{ error?: string; onClose?: () => void }> = ({
  error,
  onClose,
}) =>
  error ? (
    <Alert
      mb="5"
      status="error"
      fontSize="md"
      rounded="sm"
      variant="left-accent"
    >
      <AlertIcon />
      <AlertDescription flex="1">{error}</AlertDescription>
      <CloseButton
        alignSelf="flex-start"
        position="relative"
        right={-1}
        top={-1}
        onClick={onClose}
      />
    </Alert>
  ) : null;
