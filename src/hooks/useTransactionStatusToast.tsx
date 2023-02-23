import { SmallCloseIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  chakra,
  CloseButton,
  Spinner,
  ToastId,
  ToastProps,
  useToast,
  UseToastOptions,
} from "@chakra-ui/react";
import { ExplorerButton } from "components/common/ExplorerButton";
import { useGetWeb3Transaction } from "hooks/useGetWeb3Transaction";
import { useSessionStoreWithUndo } from "hooks/useSessionStore";
import { useWeb3Connection } from "hooks/useWeb3Connection";
import React, { useState } from "react";
import { IPubKey } from "types/internal";

const COMPLETED_TOAST_CONFIG = {
  duration: 30_000,
  isClosable: true,
};

// TODO lots of repetition in toast config

export const useTransactionStatusToast = (purpose: string) => {
  const toast = useToast();
  const [toastId, setToastId] = useState<ToastId>();

  const updateToast = (options: Omit<UseToastOptions, "id">) => {
    if (toastId) {
      toast.update(toastId, options);
    }
  };

  const connection = useWeb3Connection();
  const {
    signature,
    inProgress,
    start,
    cancel: web3Cancel,
  } = useGetWeb3Transaction({
    connection,
    onStatus: (status) => {
      // to avoid further message changes post-cancellation
      if (inProgress) {
        updateToast({
          render: (props) => (
            <TransactionStatusToast
              {...{ ...props, signature, inProgress: true, cancel }}
            />
          ),
          position: "top-right",
          status: "info",
          title: `${purpose} is in progress.`,
          description: `Confirmed by ${status.confirmations || 0}`,
        });
      }
    },
    onSuccess: () => {
      updateToast({
        ...COMPLETED_TOAST_CONFIG,
        render: (props) => (
          <TransactionStatusToast
            {...{ ...props, signature, inProgress: false, cancel }}
          />
        ),
        position: "top-right",
        status: "success",
        title: `${purpose} has succeeded.`,
        description: `Confirmed by MAX`,
      });
    },
    onError: (error) => {
      updateToast({
        ...COMPLETED_TOAST_CONFIG,
        render: (props) => (
          <TransactionStatusToast
            {...{ ...props, signature, inProgress: false, cancel }}
          />
        ),
        position: "top-right",
        status: "error",
        title: `${purpose} has failed.`,
        description: `Error: ${error}`,
      });
    },
    onTimeout: () => {
      updateToast({
        ...COMPLETED_TOAST_CONFIG,
        render: (props) => (
          <TransactionStatusToast
            {...{ ...props, signature, inProgress: false, cancel }}
          />
        ),
        position: "top-right",
        status: "error",
        title: `${purpose} has failed.`,
        description: `Error: Timeout`,
      });
    },
  });

  const cancel = () => {
    web3Cancel();
    updateToast({
      ...COMPLETED_TOAST_CONFIG,
      render: (props) => (
        <TransactionStatusToast
          {...{ ...props, signature, inProgress: false, cancel }}
        />
      ),
      position: "top-right",
      status: "warning",
      title: `${purpose} has been cancelled.`,
      description: "",
    });
  };

  return {
    toast: (signature: IPubKey) => {
      setToastId(
        toast({
          render: (props) => (
            <TransactionStatusToast
              {...{ ...props, signature, inProgress: true, cancel }}
            />
          ),
          position: "top-right",
          status: "info",
          title: `${purpose} is in progress.`,
        })
      );
      start(signature);
    },
    updateToast,
  };
};

const TransactionStatusToast: React.FC<
  ToastProps & { signature: string; inProgress: boolean; cancel: () => void }
> = ({
  status,
  variant = "solid",
  id,
  title,
  isClosable,
  onClose,
  description,
  icon,
  signature,
  cancel,
  inProgress,
}) => {
  const rpcEndpoint = useSessionStoreWithUndo((state) => state.rpcEndpoint);

  const ids = id
    ? {
        root: `toast-${id}`,
        title: `toast-${id}-title`,
        description: `toast-${id}-description`,
      }
    : undefined;

  return (
    <Alert
      addRole={false}
      status={status}
      variant={variant}
      id={ids?.root}
      alignItems="start"
      borderRadius="md"
      boxShadow="lg"
      paddingEnd={8}
      textAlign="start"
      width="auto"
      fontSize="sm"
    >
      <AlertIcon>{icon}</AlertIcon>

      <chakra.div flex="1" maxWidth="100%">
        {title && <AlertTitle id={ids?.title}>{title}</AlertTitle>}

        <AlertDescription id={ids?.description} display="block" mt="3">
          {inProgress && <Spinner size="sm" mr="3" />}
          <ExplorerButton
            value={signature}
            valueType="tx"
            rpcEndpoint={rpcEndpoint}
            variant="short-link"
            fontFamily="mono"
            fontWeight="normal"
            fontSize="sm"
            textColor="inherit"
            mb="2"
          />
          <Box>{description}</Box>
          {inProgress && (
            <Button leftIcon={<SmallCloseIcon />} onClick={cancel}>
              Cancel
            </Button>
          )}
        </AlertDescription>
      </chakra.div>

      {isClosable && (
        <CloseButton
          size="sm"
          onClick={onClose}
          position="absolute"
          insetEnd={1}
          top={1}
        />
      )}
    </Alert>
  );
};
