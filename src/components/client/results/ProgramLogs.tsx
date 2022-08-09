import { DownloadIcon } from "@chakra-ui/icons";
import {
  Code,
  Flex,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import { useSessionStoreWithoutUndo } from "../../../hooks/useSessionStore";
import { CopyButton } from "../../common/CopyButton";

export const ProgramLogs: React.FC<{
  inProgress: boolean;
  logs?: string[];
}> = ({ inProgress, logs }) => {
  const signature = useSessionStoreWithoutUndo(
    (state) => state.transactionRun.signature
  );
  const joinedUpLogs = logs?.join("\n");
  const downloadUrl = useMemo(
    () =>
      joinedUpLogs
        ? URL.createObjectURL(new Blob([joinedUpLogs], { type: "text/plain" }))
        : null,
    [joinedUpLogs]
  );

  if (inProgress) {
    return (
      <Stack>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    );
  }

  return (
    <Grid p="3" backgroundColor="gray.700" rounded="sm" position="relative">
      <Flex alignItems="center" position="absolute" top="1" right="1">
        <CopyButton value={joinedUpLogs!} isDisabled={!logs} />
        <Tooltip label="Download logs">
          <IconButton
            as="a"
            size="sm"
            variant="ghost"
            aria-label="Download logs"
            isDisabled={!logs}
            icon={<DownloadIcon />}
            href={downloadUrl!}
            download={`${signature}.log`}
          />
        </Tooltip>
      </Flex>
      {(logs || ["Run a transaction to see program logs"]).map(
        (line, index) => (
          <Code
            key={index}
            fontSize="sm"
            textColor="main.200"
            bgColor="gray.700"
          >
            {line}
          </Code>
        )
      )}
    </Grid>
  );
};
