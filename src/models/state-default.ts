import { clusterApiUrl } from "@solana/web3.js";
import { v4 as uuid } from "uuid";
import { newAccount, newInstruction } from "./internal-mappers";
import {
  IRpcEndpoint,
  ITransaction,
  ITransactionOptions,
} from "./internal-types";
import { toSortableCollection } from "./sortable";
import { AppOptions, OptionsState, TransactionState } from "./state-types";

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
