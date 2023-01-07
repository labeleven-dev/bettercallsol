import { Box, Divider, Grid } from "@chakra-ui/react";
import { AddressLookupTables } from "components/client/AddressLookupTables";
import { ClientHeader } from "components/client/ClientHeader";
import { Instructions } from "components/client/Instructions";
import { Results } from "components/client/results/Results";
import { SendButton } from "components/client/SendButton";
import React, { useRef } from "react";

export const Client: React.FC = () => {
  // used for scrolling to results
  const resultsRef = useRef<HTMLDivElement>(null);

  return (
    <Grid m="2">
      <Box p="5">
        {/* TODO split ClientHeader from TransactionHeader, without causing excessive reloads */}
        <ClientHeader sendButton={<SendButton resultsRef={resultsRef} />} />
        <AddressLookupTables />
        <Instructions />
      </Box>

      <Divider />

      <Box mt="5">
        <Results ref={resultsRef} />
      </Box>
    </Grid>
  );
};
