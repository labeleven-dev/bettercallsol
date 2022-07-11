import {
  Alert,
  AlertIcon,
  Box,
  Collapse,
  Divider,
  Grid,
} from "@chakra-ui/react";
import React from "react";
import { useTransactionStore } from "../../store";
import { Instructions } from "./Instructions";
import { Results } from "./Results";
import { TransactionHeader } from "./TransactionHeader";

export const Transaction: React.FC = () => {
  const transactionOptions = useTransactionStore(
    (state) => state.transactionOptions
  );

  return (
    <Grid m="2">
      <Box p="5">
        <TransactionHeader />

        {/* TODO remove once out of beta */}
        <Collapse
          in={transactionOptions.network.id === "mainnet-beta"}
          unmountOnExit
        >
          <Alert
            mb="2"
            fontSize="sm"
            rounded="sm"
            status="warning"
            variant="left-accent"
          >
            <AlertIcon />
            This app is currently in active development. Use MAINNET at your own
            risk.
          </Alert>
        </Collapse>

        <Instructions />
      </Box>
      <Divider />
      <Box mt="5">
        <Results />
      </Box>
    </Grid>
  );
};
