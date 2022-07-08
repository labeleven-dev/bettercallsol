import React from "react";
import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import { IconButton, Tooltip, useClipboard } from "@chakra-ui/react";

export const CopyButton: React.FC<{ value: string }> = ({ value }) => {
  const { hasCopied, onCopy } = useClipboard(value);

  return (
    <Tooltip label="Copy to Clipboard">
      <IconButton
        size="sm"
        variant="ghost"
        aria-label="Copy"
        icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
        onClick={onCopy}
      />
    </Tooltip>
  );
};
