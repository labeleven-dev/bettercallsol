import produce from "immer";
import create from "zustand";
import { AppState, DEFAULT_STATE } from "../state";

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
  };
});

useTransactionStore.subscribe((state) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
});
