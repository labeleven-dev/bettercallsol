// Models for non-transaction app state

import { Draft } from "immer";
import {
  IPubKey,
  IResults,
  IRpcEndpoint,
  ITransaction,
  ITransactionOptions,
} from "./internal-types";
import { SortableCollection } from "./sortable";

export type Explorer = "solscan" | "solanafm" | "solana" | "none";

// We mutate state using immerjs. All state fields are set to readonly
// so we don't by mistake try to mutate outside immerjs.

export interface AppOptions {
  readonly explorer: Explorer;
  readonly autoConnectWallet: boolean;
  readonly enableNumbering: boolean;
  readonly rpcEndpoints: SortableCollection<IRpcEndpoint>;
}

export interface UIState {
  readonly paletteOpen: boolean;
  readonly optionsOpen: boolean;
}

export type PersistentState = {
  readonly transactionOptions: ITransactionOptions;
  readonly appOptions: AppOptions;
  readonly firstTime: boolean;
  set: (fn: (state: Draft<PersistentState>) => void) => void;
};

export type SessionState = {
  readonly transaction: ITransaction;
  readonly results: IResults;
  readonly uiState: UIState;
  readonly keypairs: Record<IPubKey, Uint8Array>;
  set: (fn: (state: Draft<SessionState>) => void) => void;
};
