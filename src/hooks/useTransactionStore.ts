import produce from "immer";
import create from "zustand";
import { addTo, removeFrom } from "../models/sortable";
import {
  DEFAULT_TRANSACTION_STATE,
  DEFAULT_UI_INSTRUCTION_STATE,
  TransactionState,
} from "../models/state";

const LOCAL_STORAGE_KEY = "bscolTransactionState";

export const useTransactionStore = create<TransactionState>((set) => {
  // retrieve local storage
  const existingStateString = localStorage.getItem(LOCAL_STORAGE_KEY);
  const state = existingStateString
    ? JSON.parse(existingStateString)
    : DEFAULT_TRANSACTION_STATE;

  return {
    ...state,
    set: (fn) => {
      set(produce(fn));
    },
    // define these helpers since they interact with different slices of state
    addInstruction: (instruction) => {
      set(
        produce((state) => {
          addTo(state.transaction.instructions, instruction);
          state.uiState.instructions[instruction.id] =
            DEFAULT_UI_INSTRUCTION_STATE;
        })
      );
    },
    removeInstruction: (instructionId) => {
      set(
        produce((state) => {
          removeFrom(state.transaction.instructions, instructionId);
          delete state.uiState.instructions[instructionId];
        })
      );
    },
  };
});

useTransactionStore.subscribe((state) => {
  // exclude functions
  const { transaction, results, uiState } = state;

  // in progress should not survive page reloads
  const { inProgress: _inProgress, ...restOfResults } = results;

  localStorage.setItem(
    LOCAL_STORAGE_KEY,
    JSON.stringify({
      transaction,
      results: restOfResults,
      uiState,
    })
  );
});
