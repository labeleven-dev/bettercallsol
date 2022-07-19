import produce from "immer";
import create from "zustand";
import {
  AppState,
  DEFAULT_STATE,
  DEFAULT_UI_INSTRUCTION_STATE,
  IID,
} from "../models/state";

const LOCAL_STORAGE_KEY = "bscolState";

export const useTransactionStore = create<AppState>((set) => {
  // retrieve local storage
  const existingStateString = localStorage.getItem(LOCAL_STORAGE_KEY);
  const state = existingStateString
    ? JSON.parse(existingStateString)
    : DEFAULT_STATE;

  // TODO capture that it's the first time and display something helpful

  return {
    ...state,
    set: (fn) => {
      set(produce(fn));
    },
    addInstruction: (instruction) => {
      set(
        produce((state) => {
          state.transaction.instructions[instruction.id] = instruction;
          state.transaction.instructionOrder.push(instruction.id);
          state.uiState.instructions[instruction.id] =
            DEFAULT_UI_INSTRUCTION_STATE;
        })
      );
    },
    removeInstruction: (instructionId) => {
      set(
        produce((state) => {
          state.transaction.instructionOrder =
            state.transaction.instructionOrder.filter(
              (x: IID) => x !== instructionId
            );
          delete state.transaction.instructions[instructionId];
          delete state.uiState.instructions[instructionId];
        })
      );
    },
  };
});

useTransactionStore.subscribe((state) => {
  // exclude functions
  const { transactionOptions, transaction, results, appOptions, uiState } =
    state;

  // in progress should not survive page reloads
  const { inProgress: _inProgress, ...restOfResults } = results;

  localStorage.setItem(
    LOCAL_STORAGE_KEY,
    JSON.stringify({
      transactionOptions,
      transaction,
      results: restOfResults,
      appOptions,
      uiState,
    })
  );
});
