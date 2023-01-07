import { Grid } from "@chakra-ui/react";
import { Commitment, Finality } from "@solana/web3.js";
import { ChoiceOption } from "components/options/fields/ChoiceOption";
import { NumberOption } from "components/options/fields/NumberOption";
import { ToggleOption } from "components/options/fields/ToggleOption";
import { useShallowConfigStore } from "hooks/useConfigStore";
import React from "react";
import { COMMITMENT_LEVELS, FINALITY_LEVELS } from "utils/ui-constants";

export const TransactionOptions: React.FC = () => {
  const [transactionOptions, set] = useShallowConfigStore((state) => [
    state.transactionOptions,
    state.set,
  ]);

  return (
    <Grid templateColumns="1fr 1fr" gap="15px 5px" alignItems="center">
      <ChoiceOption
        id="finality"
        name="Finality"
        get={() =>
          FINALITY_LEVELS.find((x) => x.id === transactionOptions.finality)!
        }
        getChoices={() => FINALITY_LEVELS}
        set={(x) => {
          set((state) => {
            state.transactionOptions.finality = x as Finality;
          });
        }}
      />

      <ToggleOption
        id="skip-preflight"
        name="Skip preflight"
        get={() => transactionOptions.skipPreflight}
        set={(x) => {
          set((state) => {
            state.transactionOptions.skipPreflight = x;
          });
        }}
      />

      <ChoiceOption
        id="preflight-commitment"
        name="Preflight commitment level"
        get={() =>
          COMMITMENT_LEVELS.find(
            (x) => x.id === transactionOptions.preflightCommitment
          )!
        }
        getChoices={() => COMMITMENT_LEVELS}
        set={(x) => {
          set((state) => {
            state.transactionOptions.preflightCommitment = x as Commitment;
          });
        }}
      />

      <NumberOption
        id="confirm-transaction-initial-timeout"
        name="Confirm transaction initial timeout"
        get={() => transactionOptions.confirmTransactionInitialTimeout / 1_000}
        set={(x) => {
          set((state) => {
            state.transactionOptions.confirmTransactionInitialTimeout =
              x * 1_000;
          });
        }}
        format={(x) => `${x} seconds`}
      />

      <NumberOption
        id="confirm-transaction-timeout"
        name="Confirm transaction timeout"
        get={() => transactionOptions.confirmTransactionTimeout / 1_000}
        set={(x) => {
          set((state) => {
            state.transactionOptions.confirmTransactionTimeout = x * 1_000;
          });
        }}
        format={(x) => `${x} seconds`}
      />

      <NumberOption
        id="polling-period"
        name="Confirm transaction polling frequency"
        get={() => transactionOptions.pollingPeriod / 1_000}
        set={(x) => {
          set((state) => {
            state.transactionOptions.pollingPeriod = x * 1_000;
          });
        }}
        format={(x) => `${x} seconds`}
      />

      <NumberOption
        id="max-retries"
        name="Max retries"
        get={() => transactionOptions.maxRetries}
        set={(x) => {
          set((state) => {
            state.transactionOptions.maxRetries = x;
          });
        }}
        format={(x) => `${x} times`}
      />

      <ToggleOption
        id="disable-retries"
        name="Disable retries on rate limit"
        get={() => transactionOptions.disableRetryOnRateLimit}
        set={(x) => {
          set((state) => {
            state.transactionOptions.disableRetryOnRateLimit = x;
          });
        }}
      />

      <ToggleOption
        id="verify-sign-sim"
        name="Verify signature on simulation ℹ️"
        moreInfo="The wallet will prompt for signing the transaction, even though it is a simulation."
        get={() => transactionOptions.signVerifySimulation}
        set={(x) => {
          set((state) => {
            state.transactionOptions.signVerifySimulation = x;
          });
        }}
      />
    </Grid>
  );
};
