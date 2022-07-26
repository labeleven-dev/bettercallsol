import produce from "immer";
import create from "zustand";
import { DEFAULT_OPTIONS_STATE, OptionsState } from "../models/state";

const LOCAL_STORAGE_KEY = "bcsolOptionsState";

// excludes functions
const saveState = ({ transactionOptions, appOptions }: OptionsState) => {
  localStorage.setItem(
    LOCAL_STORAGE_KEY,
    JSON.stringify({
      transactionOptions,
      appOptions,
    })
  );
};

export const useOptionsStore = create<OptionsState>((set) => {
  // retrieve local storage
  const existingStateString = localStorage.getItem(LOCAL_STORAGE_KEY);
  const state = existingStateString
    ? JSON.parse(existingStateString)
    : DEFAULT_OPTIONS_STATE;

  if (!existingStateString) {
    // TODO display a welcome
    saveState(state);
  }

  return {
    ...state,
    set: (fn) => {
      set(produce(fn));
    },
  };
});

useOptionsStore.subscribe((state) => {
  saveState(state);
});
