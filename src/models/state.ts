// Models for non-transaction app state

import { clusterApiUrl } from "@solana/web3.js";
import { Draft } from "immer";
import { WritableDraft } from "immer/dist/internal";
import { IID, toSortableCollection } from "./sortable";
import {
  IInstruction,
  IResults,
  IRpcEndpoint,
  ITransaction,
  ITransactionOptions,
} from "./web3";

export type Explorer = "solscan" | "solanafm" | "solana" | "none";

// We mutate state using immerjs. All state fields are set to readonly
// so we don't by mistake try to mutate outside immerjs.

export interface AppOptions {
  readonly explorer: Explorer;
  readonly autoConnectWallet: boolean;
  readonly rpcEndpoints: IRpcEndpoint[];
}

export interface UIInstructionState {
  readonly disabled: boolean;
  readonly expanded: boolean;
}

export const DEFAULT_UI_INSTRUCTION_STATE = {
  disabled: false,
  expanded: true,
};

export interface UIState {
  readonly instructions: Record<IID, UIInstructionState>;
  readonly paletteOpen: boolean;
  readonly optionsOpen: boolean;
}

export type AppState = {
  readonly transactionOptions: ITransactionOptions;
  readonly transaction: ITransaction;
  readonly results: IResults;
  readonly appOptions: AppOptions;
  readonly uiState: UIState;
  set: (fn: (state: Draft<AppState>) => void) => void;
  addInstruction: (instruction: IInstruction) => void;
  removeInstruction: (instructionId: IID) => void;
};

export const EXPLORERS: { id: Explorer; name: string }[] = [
  { id: "solscan", name: "Solscan" },
  { id: "solanafm", name: "SolanaFM" },
  { id: "solana", name: "Solana Explorer" },
  { id: "none", name: "None" },
];

export const DEFAULT_RPC_ENDPOINTS: IRpcEndpoint[] = [
  {
    provider: "Solana",
    network: "devnet",
    url: clusterApiUrl("devnet"),
    enabled: true,
    custom: false,
  },
  {
    provider: "Solana",
    network: "testnet",
    url: clusterApiUrl("testnet"),
    enabled: true,
    custom: false,
  },
  {
    provider: "Solana",
    network: "mainnet-beta",
    url: clusterApiUrl("mainnet-beta"),
    enabled: false,
    custom: false,
  },
  {
    provider: "Serum",
    network: "mainnet-beta",
    url: "https://solana-api.projectserum.com",
    enabled: false,
    custom: false,
  },
  {
    provider: "You",
    network: "local",
    url: "http://0.0.0.0:8899",
    enabled: true,
    custom: true,
  },
];

export const DEFAULT_APP_OPTIONS: AppOptions = {
  explorer: "solanafm",
  autoConnectWallet: true,
  rpcEndpoints: DEFAULT_RPC_ENDPOINTS,
};

export const DEFAULT_UI_STATE: UIState = {
  instructions: {
    "ba928274-35b6-48c4-a16c-c4346f0ffaf2": DEFAULT_UI_INSTRUCTION_STATE,
  },
  paletteOpen: false,
  optionsOpen: false,
};

export const DEFAUT_TRANSACTION_OPTIONS: ITransactionOptions = {
  rpcEndpoint: DEFAULT_RPC_ENDPOINTS[0],
  skipPreflight: true,
  commitment: "processed",
  preflightCommitment: "processed",
  confirmTransactionInitialTimeout: 30_000,
  confirmTransactionTimeout: 30_000,
  maxRetries: 5,
  disableRetryOnRateLimit: true,
  pollingPeriod: 1_000,
};

// TODO just for testing
const DEFAULT_TRANSACTION: ITransaction = {
  name: "Baby's First Transaction",
  instructions: toSortableCollection([
    {
      id: "ba928274-35b6-48c4-a16c-c4346f0ffaf2",
      name: "Memo",
      programId: "Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo",
      accounts: toSortableCollection([
        {
          id: "36683e70-f3ec-4d6d-a727-a08eefb549ed",
          name: "Signer",
          pubkey: "EQPzCaaYtoCRqaeHkahZWHaX6kyC6K3ytu9t86WvR4Y3",
          isWritable: true,
          isSigner: true,
        },
      ]),
      data: "hello",
    },
  ]),
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
//     },
//   }
// }

export const DEFAULT_STATE: AppState = {
  transaction: DEFAULT_TRANSACTION,
  results: {
    inProgress: false,
    signature: "",
    logs: ["Run a transaction to see logs"],
  },
  transactionOptions: DEFAUT_TRANSACTION_OPTIONS,
  appOptions: DEFAULT_APP_OPTIONS,
  uiState: DEFAULT_UI_STATE,
  set: () => {}, // set by the hook
  addInstruction: (instruction) => {}, // set by the hook
  removeInstruction: (id) => {}, // set by the hook
};

export const instructionGetter =
  (id: IID) => (state: WritableDraft<AppState>) =>
    state.transaction.instructions.map[id];
