import produce from "immer";
import create from "zustand";
import { DEFAULT_PERSISTENT_STATE } from "../models/state-default";
import { PersistentState } from "../models/state-types";

const LOCAL_STORAGE_KEY = "bcsol-store";

// excludes functions
const saveState = ({ transactionOptions, appOptions }: PersistentState) => {
  localStorage.setItem(
    LOCAL_STORAGE_KEY,
    JSON.stringify({
      transactionOptions,
      appOptions,
    })
  );
};

export const usePersistentStore = create<PersistentState>((set) => {
  // retrieve local storage
  const existingStateString = localStorage.getItem(LOCAL_STORAGE_KEY);
  const state = existingStateString
    ? JSON.parse(existingStateString)
    : DEFAULT_PERSISTENT_STATE;

  if (!existingStateString) {
    saveState(state);
  }

  return {
    ...state,
    set: (fn) => {
      set(produce(fn));
    },
  };
});

usePersistentStore.subscribe((state) => {
  saveState(state);
});
