import { Box, Divider, Grid } from "@chakra-ui/react";
import React, { useRef } from "react";
import { Instructions } from "./Instructions";
import { Results } from "./results/Results";
import { TransactionHeader } from "./TransactionHeader";

export const Transaction: React.FC = () => {
  // used for scrolling to results
  const resultsRef = useRef<HTMLDivElement>(null);

  return (
    <Grid m="2">
      <Box p="5">
        <TransactionHeader resultsRef={resultsRef} />
        <Instructions />
      </Box>

      <Divider />

      <Box mt="5">
        <Results ref={resultsRef} />
      </Box>
    </Grid>
  );
};
