import { Draft } from "immer";
import { WritableDraft } from "immer/dist/internal";
import {
  DEFAULT_NETWORKS,
  IID,
  IResults,
  ITransaction,
  ITransactionOptions,
} from "./web3";

export type Explorer = "solscan" | "solana" | "none";
export const EXPLORERS: { id: Explorer; name: string }[] = [
  { id: "solscan", name: "Solscan" },
  { id: "solana", name: "Solana Explorer" },
  { id: "none", name: "None" },
];

export interface AppOptions {
  explorer: Explorer;
  disableMainnet: boolean;
}

export type AppState = {
  transactionOptions: ITransactionOptions;
  transaction: ITransaction;
  results: IResults;
  appOptions: AppOptions;
  optionsOpen: boolean;
  set: (fn: (state: Draft<AppState>) => void) => void;
};

// TODO just for testing
const DEFAULT_TRANSACTION: ITransaction = {
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
          name: "Signer",
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

// const DEFAULT_TRANSACTION: ITransaction = {
//   name: "My Transcation",
//   instructionOrder: ["ba928274-35b6-48c4-a16c-c4346f0ffaf2"],
//   instructions: {
//     "ba928274-35b6-48c4-a16c-c4346f0ffaf2": {
//       id:"ba928274-35b6-48c4-a16c-c4346f0ffaf2",
//       name: "Instruction #1",
//       programId: "",
//       accountOrder: [],
//       accounts: {},
//       data: "",
//       disabled: false,
//       expanded: true
//     },
//   }
// }

export const DEFAULT_STATE: AppState = {
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
    pollingPeriod: 1_000,
  },
  transaction: DEFAULT_TRANSACTION,
  results: {
    inProgress: false,
    signature: "",
    logs: ["Run a transaction to see logs"],
  },
  appOptions: {
    explorer: "solscan",
    disableMainnet: false,
  },
  optionsOpen: false,
  set: () => {}, // set by the hook
};

export const instructionGetter =
  (id: IID) => (state: AppState | WritableDraft<AppState>) =>
    state.transaction.instructions[id];

export const accountGetter =
  (instructionId: IID, accountId: IID) =>
  (state: AppState | WritableDraft<AppState>) =>
    state.transaction.instructions[instructionId].accounts[accountId];
