import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import { IconButton, Tooltip, useClipboard } from "@chakra-ui/react";
import React from "react";
import { CustomIconButtonProps } from "../../chakra";

export const CopyButton: React.FC<
  {
    value: string;
  } & CustomIconButtonProps
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
