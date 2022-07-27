import produce from "immer";
import { WritableDraft } from "immer/dist/internal";
import create from "zustand";
import { addTo, IID, removeFrom } from "../models/sortable";
import {
  DEFAULT_TRANSACTION_STATE,
  DEFAULT_UI_INSTRUCTION_STATE,
} from "../models/state-default";
import { TransactionState, UIInstructionState } from "../models/state-types";

const LOCAL_STORAGE_KEY = "bcsolTransactionState";

// exclude functions
const saveState = ({ transaction, results, uiState }: TransactionState) => {
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
};

export const useTransactionStore = create<TransactionState>((set) => {
  // retrieve local storage
  const existingStateString = localStorage.getItem(LOCAL_STORAGE_KEY);
  const state = existingStateString
    ? JSON.parse(existingStateString)
    : DEFAULT_TRANSACTION_STATE;

  if (!existingStateString) {
    saveState(state);
  }

  return {
    ...state,
    set: (fn) => {
      set(produce(fn));
    },
    // define these helpers since they interact with different slices of state
    setTransaction: (transaction) => {
      set(
        produce((state: WritableDraft<TransactionState>) => {
          state.transaction = transaction;
          state.uiState.instructions = transaction.instructions.order.reduce(
            (acc, id) => {
              acc[id] = DEFAULT_UI_INSTRUCTION_STATE;
              return acc;
            },
            {} as Record<IID, UIInstructionState>
          );
        })
      );
    },
    addInstruction: (instruction) => {
      set(
        produce((state: WritableDraft<TransactionState>) => {
          addTo(state.transaction.instructions, instruction);
          state.uiState.instructions[instruction.id] =
            DEFAULT_UI_INSTRUCTION_STATE;
        })
      );
    },
    removeInstruction: (instructionId) => {
      set(
        produce((state: WritableDraft<TransactionState>) => {
          removeFrom(state.transaction.instructions, instructionId);
          delete state.uiState.instructions[instructionId];
        })
      );
    },
  };
});

useTransactionStore.subscribe((state) => {
  saveState(state);
});
