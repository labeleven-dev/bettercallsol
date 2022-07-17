import { FormControl, Grid } from "@chakra-ui/react";
import { Commitment } from "@solana/web3.js";
import React from "react";
import { useTransactionStore } from "../../hooks/useTransactionStore";
import { COMMITMENT_LEVELS } from "../../models/web3";
import { ChoiceOption } from "../common/options/ChoiceOption";
import { NumberOption } from "../common/options/NumberOption";
import { ToggleOption } from "../common/options/ToggleOption";

export const TransactionOptions: React.FC = () => {
  const transactionOptions = useTransactionStore(
    (state) => state.transactionOptions
  );
  const set = useTransactionStore((state) => state.set);

  return (
    <FormControl display="flex" alignItems="center">
      <Grid templateColumns="250px 1fr" gap="15px 5px">
        <ChoiceOption
          id="commitment"
          name="Commitment level"
          get={() =>
            COMMITMENT_LEVELS.find(
              (x) => x.id === transactionOptions.commitment
            )!
          }
          getChoices={() => COMMITMENT_LEVELS}
          set={(x) => {
            set((state) => {
              state.transactionOptions.commitment = x as Commitment;
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
          get={() =>
            transactionOptions.confirmTransactionInitialTimeout / 1_000
          }
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
      </Grid>
    </FormControl>
  );
};