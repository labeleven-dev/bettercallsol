import { FormControl, Grid } from "@chakra-ui/react";
import React from "react";
import { useTransactionStore } from "../../hooks/useTransactionStore";
import { Explorer, EXPLORERS } from "../../models/state";
import { ChoiceOption } from "../common/ChoiceOption";
import { ToggleOption } from "../common/ToggleOption";

export const GeneralOptions: React.FC = () => {
  const appOptions = useTransactionStore((state) => state.appOptions);
  const set = useTransactionStore((state) => state.set);

  // explorer: Explorer;
  // hideNumbering: boolean;
  // disableMainnet: boolean;

  return (
    <FormControl display="flex" alignItems="center">
      <Grid templateColumns="250px 1fr" gap="15px 5px">
        <ChoiceOption
          id="explorer"
          name="Explorer"
          get={() => EXPLORERS.find((x) => x.id === appOptions.explorer)!}
          getChoices={() => EXPLORERS}
          set={(x) => {
            set((state) => {
              state.appOptions.explorer = x as Explorer;
            });
          }}
        />

        <ToggleOption
          id="disable-mainnet"
          name="Remove Mainnet from the list"
          get={() => appOptions.disableMainnet}
          set={(x) => {
            set((state) => {
              state.appOptions.disableMainnet = x;
            });
          }}
        />
      </Grid>
    </FormControl>
  );
};
