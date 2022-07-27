// Models for non-transaction app state

import { clusterApiUrl } from "@solana/web3.js";
import { Draft } from "immer";
import { v4 as uuid } from "uuid";
import { IID, SortableCollection, toSortableCollection } from "./sortable";
import {
  IInstruction,
  IResults,
  IRpcEndpoint,
  ITransaction,
  ITransactionOptions,
  newAccount,
  newInstruction,
} from "./web3";

export type Explorer = "solscan" | "solanafm" | "solana" | "none";

// We mutate state using immerjs. All state fields are set to readonly
// so we don't by mistake try to mutate outside immerjs.

export interface AppOptions {
  readonly explorer: Explorer;
  readonly autoConnectWallet: boolean;
  readonly enableNumbering: boolean;
  readonly rpcEndpoints: SortableCollection<IRpcEndpoint>;
}

export interface UIInstructionState {
  readonly disabled: boolean;
  readonly expanded: boolean;
}

export interface UIState {
  readonly instructions: Record<IID, UIInstructionState>;
  readonly paletteOpen: boolean;
  readonly optionsOpen: boolean;
  readonly welcomeOpen: boolean;
}

export type OptionsState = {
  readonly transactionOptions: ITransactionOptions;
  readonly appOptions: AppOptions;
  set: (fn: (state: Draft<OptionsState>) => void) => void;
};

export type TransactionState = {
  readonly transaction: ITransaction;
  readonly results: IResults;
  readonly uiState: UIState;
  set: (fn: (state: Draft<TransactionState>) => void) => void;
  addInstruction: (instruction: IInstruction) => void;
  removeInstruction: (instructionId: IID) => void;
};

export const EXPLORERS: { id: Explorer; name: string }[] = [
  { id: "solscan", name: "Solscan" },
  { id: "solanafm", name: "SolanaFM" },
  { id: "solana", name: "Solana Explorer" },
  { id: "none", name: "None" },
];

///// Default state //////

export const DEFAULT_RPC_ENDPOINTS: IRpcEndpoint[] = [
  {
    id: uuid(),
    provider: "Solana",
    network: "devnet",
    url: clusterApiUrl("devnet"),
    enabled: true,
    custom: false,
  },
  {
    id: uuid(),
    provider: "Solana",
    network: "testnet",
    url: clusterApiUrl("testnet"),
    enabled: true,
    custom: false,
  },
  {
    id: uuid(),
    provider: "Solana",
    network: "mainnet-beta",
    url: clusterApiUrl("mainnet-beta"),
    enabled: true,
    custom: false,
  },
  {
    id: uuid(),
    provider: "Serum",
    network: "mainnet-beta",
    url: "https://solana-api.projectserum.com",
    enabled: true,
    custom: false,
  },
  {
    id: uuid(),
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
  enableNumbering: false,
  rpcEndpoints: toSortableCollection(DEFAULT_RPC_ENDPOINTS),
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

const DEFAULT_TRANSACTION: ITransaction = {
  name: "New Transcation",
  instructions: toSortableCollection([
    { ...newInstruction(), accounts: toSortableCollection([newAccount()]) },
  ]),
};

export const DEFAULT_UI_INSTRUCTION_STATE = {
  disabled: false,
  expanded: true,
};

export const DEFAULT_TRANSACTION_STATE: TransactionState = {
  transaction: DEFAULT_TRANSACTION,
  results: {
    inProgress: false,
    signature: "",
    logs: ["Run a transaction to see logs"],
  },
  uiState: {
    instructions: {
      [DEFAULT_TRANSACTION.instructions.order[0]]: DEFAULT_UI_INSTRUCTION_STATE,
    },
    paletteOpen: false,
    optionsOpen: false,
    welcomeOpen: true,
  },
  set: () => {}, // set by the hook
  addInstruction: (_) => {}, // set by the hook
  removeInstruction: (_) => {}, // set by the hook
};

export const DEFAULT_OPTIONS_STATE: OptionsState = {
  transactionOptions: DEFAUT_TRANSACTION_OPTIONS,
  appOptions: DEFAULT_APP_OPTIONS,
  set: () => {}, // set by the hook
};
