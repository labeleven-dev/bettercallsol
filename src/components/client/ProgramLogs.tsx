import { Code, Grid, Skeleton, Stack } from "@chakra-ui/react";
import React from "react";
import { useTransactionStore } from "../../store";

export const ProgramLogs: React.FC = () => {
  const results = useTransactionStore((state) => state.results);

  if (results.inProgress) {
    return (
      <Stack>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    );
  }

  if (!results.logs) {
    return null;
  }

  return (
    <Grid p="3" backgroundColor="gray.700" rounded="sm">
      {results.logs.map((line, index) => (
        <Code key={index} fontSize="sm" textColor="main.200" bgColor="gray.700">
          {line}
        </Code>
      ))}
    </Grid>
  );
};
