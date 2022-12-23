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
import { CopyButton } from "components/common/CopyButton";
import { useSessionStoreWithoutUndo } from "hooks/useSessionStore";
import React, { useMemo } from "react";

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
    <Grid
      p="3"
      minH="45px"
      backgroundColor="gray.700"
      rounded="sm"
      position="relative"
    >
      {logs && (
        <Flex alignItems="center" position="absolute" top="1" right="1">
          <CopyButton value={joinedUpLogs!} />
          <Tooltip label="Download logs">
            <IconButton
              as="a"
              size="sm"
              variant="ghost"
              aria-label="Download logs"
              icon={<DownloadIcon />}
              href={downloadUrl!}
              download={`${signature}.log`}
            />
          </Tooltip>
        </Flex>
      )}
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
