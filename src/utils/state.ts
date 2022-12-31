import { clusterApiUrl } from "@solana/web3.js";
import {
  INetwork,
  IRpcEndpoint,
  ITransaction,
  ITransactionOptions,
  ITransactionRun,
} from "types/internal";
import {
  AppOptions,
  PersistentState,
  SessionStateWithoutUndo,
  SessionStateWithUndo,
} from "types/state";
import { newAccount, newInstruction } from "utils/internal";
import { toSortableCollection } from "utils/sortable";
import { v4 as uuid } from "uuid";

export const RPC_NETWORK_OPTIONS: INetwork[] = [
  "devnet",
  "testnet",
  "mainnet-beta",
  "custom",
];

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
    provider: "Localhost",
    network: "custom",
    url: "http://127.0.0.1:8899",
    enabled: true,
    custom: true,
  },
];

export const DEFAULT_APP_OPTIONS: AppOptions = {
  explorer: "solana",
  autoConnectWallet: true,
  enableNumbering: false,
  scrollToResults: true,
  rpcEndpoints: toSortableCollection(DEFAULT_RPC_ENDPOINTS),
};

export const DEFAUT_TRANSACTION_OPTIONS: ITransactionOptions = {
  skipPreflight: true,
  finality: "confirmed",
  preflightCommitment: "processed",
  confirmTransactionInitialTimeout: 60_000,
  confirmTransactionTimeout: 60_000,
  maxRetries: 5,
  disableRetryOnRateLimit: true,
  pollingPeriod: 1_000,
  signVerifySimulation: false,
};

export const DEFAULT_TRANSACTION: ITransaction = {
  name: "",
  version: 0,
  instructions: toSortableCollection([
    { ...newInstruction(), accounts: toSortableCollection([newAccount()]) },
  ]),
};

export const EMPTY_TRANSACTION: ITransaction = {
  name: "",
  version: "legacy",
  instructions: toSortableCollection([]),
};

export const DEFAULT_TRANSACTION_RUN: ITransactionRun = {
  inProgress: false,
  signature: "",
  error: "",
};

export const DEFAULT_SESSION_STATE_WITH_UNDO: SessionStateWithUndo = {
  transaction: DEFAULT_TRANSACTION,
  rpcEndpoint: DEFAULT_RPC_ENDPOINTS[0],
  keypairs: {},
  set: () => {}, // set by the hook
};

export const DEFAULT_SESSION_STATE_WITHOUT_UNDO: SessionStateWithoutUndo = {
  transactionRun: DEFAULT_TRANSACTION_RUN,
  uiState: {
    runType: "send",
    paletteOpen: false,
    optionsOpen: false,
    shareOpen: false,
    infoOpen: false,
    descriptionVisible: false,
  },
  set: () => {}, // set by the hook
};

export const DEFAULT_PERSISTENT_STATE: PersistentState = {
  transactionOptions: DEFAUT_TRANSACTION_OPTIONS,
  appOptions: DEFAULT_APP_OPTIONS,
  firstTime: true,
  set: () => {}, // set by the hook
};
