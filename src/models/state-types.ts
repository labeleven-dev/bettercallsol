// Models for non-transaction app state

import { Draft } from "immer";
import {
  IInstruction,
  IResults,
  IRpcEndpoint,
  ITransaction,
  ITransactionOptions,
} from "./internal-types";
import { IID, SortableCollection } from "./sortable";

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
