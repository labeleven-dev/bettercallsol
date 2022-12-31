import { Box, Divider, Grid } from "@chakra-ui/react";
import { Instructions } from "components/client/Instructions";
import { Results } from "components/client/results/Results";
import { TransactionHeader } from "components/client/TransactionHeader";
import React, { useRef } from "react";

export const Client: React.FC = () => {
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
