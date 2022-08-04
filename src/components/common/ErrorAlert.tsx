import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertProps,
  CloseButton,
} from "@chakra-ui/react";
import React from "react";

export const ErrorAlert: React.FC<
  { error?: string; onClose?: () => void } & AlertProps
> = ({ error, onClose, ...theRest }) =>
  error ? (
    <Alert
      {...theRest}
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
