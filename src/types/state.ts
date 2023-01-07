// Models for non-transaction app state

import { Draft } from "immer";
import {
  IPubKey,
  IRpcEndpoint,
  ITransaction,
  ITransactionOptions,
  ITransactionRun,
} from "./internal";
import { SortableCollection } from "./sortable";

export type Explorer =
  | "solana"
  | "solanafm"
  | "solanaBeach"
  | "solscan"
  | "none";

export type RunType = "send" | "simulate";

// We mutate state using immerjs. All state fields are set to readonly
// so we don't by mistake try to mutate outside immerjs.

export interface AppOptions {
  readonly explorer: Explorer;
  readonly autoConnectWallet: boolean;
  readonly scrollToResults: boolean;
  readonly enableNumbering: boolean;
  readonly rpcEndpoints: SortableCollection<IRpcEndpoint>;
}

export interface UIState {
  readonly runType: RunType;
  readonly paletteOpen: boolean;
  readonly optionsOpen: boolean;
  readonly shareOpen: boolean;
  readonly infoOpen: boolean;
  readonly descriptionVisible: boolean;
  readonly addressLookupTableExpanded: boolean;
}

////// State Stores //////

export interface PersistentState {
  readonly transactionOptions: ITransactionOptions;
  readonly appOptions: AppOptions;
  readonly firstTime: boolean;
  set: (fn: (state: Draft<PersistentState>) => void) => void;
}

export interface SessionStateWithUndo {
  readonly transaction: ITransaction;
  readonly rpcEndpoint: IRpcEndpoint;
  readonly keypairs: Record<IPubKey, Uint8Array>;
  set: (fn: (state: Draft<SessionStateWithUndo>) => void) => void;
}

export interface SessionStateWithoutUndo {
  readonly transactionRun: ITransactionRun;
  readonly uiState: UIState;
  set: (fn: (state: Draft<SessionStateWithoutUndo>) => void) => void;
}
