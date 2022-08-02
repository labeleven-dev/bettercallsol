import { Code, Grid, Skeleton, Stack } from "@chakra-ui/react";
import React from "react";

export const ProgramLogs: React.FC<{
  inProgress: boolean;
  logs?: string[];
}> = ({ inProgress, logs }) => {
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
    <Grid p="3" backgroundColor="gray.700" rounded="sm">
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
