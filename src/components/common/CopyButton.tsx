import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import {
  IconButton,
  IconButtonProps,
  Tooltip,
  useClipboard,
} from "@chakra-ui/react";
import React from "react";

export const CopyButton: React.FC<
  {
    value: string;
  } & Omit<IconButtonProps, "aria-label">
> = ({ value, ...theRest }) => {
  const { hasCopied, onCopy } = useClipboard(value);

  return (
    <Tooltip label="Copy to Clipboard">
      <IconButton
        size="sm"
        variant="ghost"
        icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
        aria-label="Copy"
        onClick={onCopy}
        {...theRest}
      />
    </Tooltip>
  );
};
