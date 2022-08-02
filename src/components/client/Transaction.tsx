import {
  Alert,
  AlertIcon,
  Box,
  Collapse,
  Divider,
  Grid,
} from "@chakra-ui/react";
import React from "react";
import { useSessionStoreWithUndo } from "../../hooks/useSessionStore";
import { Instructions } from "./Instructions";
import { Results } from "./results/Results";
import { TransactionHeader } from "./TransactionHeader";

export const Transaction: React.FC = () => {
  const [transaction, rpcEndpoint] = useSessionStoreWithUndo((state) => [
    state.transaction,
    state.rpcEndpoint,
  ]);

  return (
    <Grid m="2">
      <Box p="5">
        <TransactionHeader transaction={transaction} />

        {/* TODO remove once out of beta */}
        <Collapse in={rpcEndpoint.provider === "mainnet-beta"} unmountOnExit>
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

        <Instructions instructions={transaction.instructions} />
      </Box>
      <Divider />
      <Box mt="5">
        <Results />
      </Box>
    </Grid>
  );
};
