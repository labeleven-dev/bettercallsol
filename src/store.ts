import produce, { Draft } from "immer";
import { WritableDraft } from "immer/dist/internal";
import create from "zustand";
import {
  DEFAULT_NETWORKS,
  IID,
  IResults,
  ITransaction,
  ITransactionOptions,
} from "./web3";

export interface AppOptions {
  pollingPeriod: number;
}

export type AppState = {
  transactionOptions: ITransactionOptions;
  transaction: ITransaction;
  results: IResults;
  appOptions: AppOptions;
  set: (fn: (state: Draft<AppState>) => void) => void;
};

const temp: ITransaction = {
  name: "Baby's First Transaction",
  instructionOrder: ["aaa"],
  instructions: {
    aaa: {
      id: "aaa",
      name: "Memo",
      programId: "Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo",
      // accountOrder: [],
      // accounts: {},
      accountOrder: ["111"],
      accounts: {
        "111": {
          id: "111",
          name: "#1",
          pubkey: "EQPzCaaYtoCRqaeHkahZWHaX6kyC6K3ytu9t86WvR4Y3",
          isWritable: true,
          isSigner: true,
        },
      },
      data: "hello",
      disabled: false,
      expanded: true,
    },
  },
};

export const useTransactionStore = create<AppState>((set) => ({
  transactionOptions: {
    network: DEFAULT_NETWORKS[0],
    customNetworks: [],
    skipPreflight: true,
    commitment: "processed",
    preflightCommitment: "processed",
    confirmTransactionInitialTimeout: 30_000,
    confirmTransactionTimeout: 30_000,
    maxRetries: 5,
    disableRetryOnRateLimit: true,
  },
  transaction: temp, // TODO remove
  results: {
    inProgress: false,
    signature: "",
    logs: ["Run a transaction to see logs"],
  },
  appOptions: {
    pollingPeriod: 1_000,
  },
  set: (fn) => set(produce(fn)),
}));

export const instructionGetter =
  (id: IID) => (state: AppState | WritableDraft<AppState>) =>
    state.transaction.instructions[id];

export const accountGetter =
  (instructionId: IID, accountId: IID) =>
  (state: AppState | WritableDraft<AppState>) =>
    state.transaction.instructions[instructionId].accounts[accountId];
