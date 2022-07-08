import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import { IconButton, Tooltip, useClipboard } from "@chakra-ui/react";
import React from "react";

export const CopyButton: React.FC<{
  value: string;
  isDisabled: boolean;
  [x: string]: any;
}> = ({ value, isDisabled = false, ...theRest }) => {
  const { hasCopied, onCopy } = useClipboard(value);

  return (
    <Tooltip label="Copy to Clipboard">
      <IconButton
        size="sm"
        variant="ghost"
        aria-label="Copy"
        icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
        onClick={onCopy}
        isDisabled={isDisabled}
        {...theRest}
      />
    </Tooltip>
  );
};
