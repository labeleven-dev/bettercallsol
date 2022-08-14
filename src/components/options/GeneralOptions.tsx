import { Grid } from "@chakra-ui/react";
import React from "react";
import { usePersistentStore } from "../../hooks/usePersistentStore";
import { Explorer } from "../../types/state";
import { EXPLORERS } from "../../utils/ui-constants";
import { ChoiceOption } from "./fields/ChoiceOption";
import { ToggleOption } from "./fields/ToggleOption";

export const GeneralOptions: React.FC = () => {
  const [appOptions, set] = usePersistentStore((state) => [
    state.appOptions,
    state.set,
  ]);

  return (
    <Grid templateColumns="1fr 1fr" gap="15px 5px" alignItems="center">
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
  );
};
