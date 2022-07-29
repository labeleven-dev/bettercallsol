import { FormControl, Grid } from "@chakra-ui/react";
import React from "react";
import { useOptionsStore } from "../../hooks/useOptionsStore";
import { Explorer } from "../../models/state-types";
import { EXPLORERS } from "../../models/ui-constants";
import { ChoiceOption } from "./fields/ChoiceOption";
import { ToggleOption } from "./fields/ToggleOption";

export const GeneralOptions: React.FC = () => {
  const { appOptions, set } = useOptionsStore((state) => state);

  return (
    <FormControl display="flex" alignItems="center">
      <Grid templateColumns="270px 1fr" gap="15px 5px">
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
          id="autoconnect-wallet"
          name="Auto-connect wallet"
          get={() => appOptions.autoConnectWallet}
          set={(x) => {
            set((state) => {
              state.appOptions.autoConnectWallet = x;
            });
          }}
        />

        <ToggleOption
          id="enable-numbering"
          name="Enable numbering"
          get={() => appOptions.enableNumbering}
          set={(x) => {
            set((state) => {
              state.appOptions.enableNumbering = x;
            });
          }}
        />
      </Grid>
    </FormControl>
  );
};
