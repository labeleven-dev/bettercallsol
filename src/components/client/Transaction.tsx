import { Box, Divider, Flex, Grid, Heading } from "@chakra-ui/react";
import React from "react";
import { useSessionStoreWithUndo } from "../../hooks/useSessionStore";
import { EditableName } from "../common/EditableName";
import { Instructions } from "./Instructions";
import { Results } from "./results/Results";
import { TransactionHeader } from "./TransactionHeader";

export const Transaction: React.FC = () => {
  const [transaction, set] = useSessionStoreWithUndo((state) => [
    state.transaction,
    state.set,
  ]);

  return (
    <Grid m="2">
      <Box p="5">
        <TransactionHeader transaction={transaction} />

        <Flex mt="5" mb="3" alignItems="center">
          <Heading flex="1" size="lg">
            <EditableName
              tooltip="Click to edit"
              tooltipProps={{ placement: "bottom-start" }}
              previewProps={{ p: "3px 10px 3px 10px" }}
              inputProps={{ p: "3px 10px 3px 10px" }}
              placeholder="Unnamed Transaction"
              value={transaction.name}
              onChange={(value) =>
                set((state) => {
                  state.transaction.name = value;
                })
              }
            />
          </Heading>
        </Flex>

        <Instructions instructions={transaction.instructions} />
      </Box>

      <Divider />

      <Box mt="5">
        <Results />
      </Box>
    </Grid>
  );
};
