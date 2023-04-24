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

export type RunType = "send" | "squads" | "clockwork";

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
  readonly simulate: boolean;
  readonly sidePanel: "import" | "closed";
  readonly optionsOpen: boolean;
  readonly shareOpen: boolean;
  readonly infoOpen: boolean;
  readonly descriptionVisible: boolean;
}

export interface SquadsConfig {
  readonly programId: IPubKey;
  readonly multisig: IPubKey;
  readonly authorityIndex: number;
  readonly activateTransaction: boolean;
}

export interface ClockworkConfig {
  readonly threadId: string;
  readonly amount: number;
  readonly fee: number | "";
  readonly rateLimit: number | "";
  readonly trigger: "account" | "cron" | "now" | "slot" | "epoch";
  readonly cronTrigger: {
    schedule: string;
    skippable: boolean;
  };
  readonly accountTrigger: {
    address: string;
    offset: number;
    size: number;
  };
  readonly slotTrigger: {
    slot: number;
  };
  readonly epochTrigger: {
    epoch: number;
  };
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
  readonly squadsConfig: SquadsConfig;
  readonly clockworkConfig: ClockworkConfig;
  set: (fn: (state: Draft<SessionStateWithUndo>) => void) => void;
}

export interface SessionStateWithoutUndo {
  readonly transactionRun: ITransactionRun;
  readonly uiState: UIState;
  set: (fn: (state: Draft<SessionStateWithoutUndo>) => void) => void;
}
