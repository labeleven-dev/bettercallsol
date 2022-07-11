import { Draft } from "immer";
import { WritableDraft } from "immer/dist/internal";
import { IID, IResults, ITransaction, ITransactionOptions } from "./web3";

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

export const instructionGetter =
  (id: IID) => (state: AppState | WritableDraft<AppState>) =>
    state.transaction.instructions[id];

export const accountGetter =
  (instructionId: IID, accountId: IID) =>
  (state: AppState | WritableDraft<AppState>) =>
    state.transaction.instructions[instructionId].accounts[accountId];
