import produce from "immer";
import create from "zustand";
import { DEFAULT_OPTIONS_STATE, OptionsState } from "../models/state";

const LOCAL_STORAGE_KEY = "bscolOptionsState";

export const useOptionsStore = create<OptionsState>((set) => {
  // retrieve local storage
  const existingStateString = localStorage.getItem(LOCAL_STORAGE_KEY);
  const state = existingStateString
    ? JSON.parse(existingStateString)
    : DEFAULT_OPTIONS_STATE;

  // TODO capture that it's the first time and display something helpful
  // TODO save options if first time

  return {
    ...state,
    set: (fn) => {
      set(produce(fn));
    },
  };
});

useOptionsStore.subscribe((state) => {
  // exclude functions
  const { transactionOptions, appOptions } = state;

  localStorage.setItem(
    LOCAL_STORAGE_KEY,
    JSON.stringify({
      transactionOptions,
      appOptions,
    })
  );
});
