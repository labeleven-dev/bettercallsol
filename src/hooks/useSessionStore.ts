import produce from "immer";
import create from "zustand";
import { DEFAULT_SESSION_STATE } from "../models/state-default";
import { SessionState } from "../models/state-types";

export const useSessionStore = create<SessionState>((set) => {
  return {
    ...DEFAULT_SESSION_STATE,
    set: (fn) => {
      set(produce(fn));
    },
  };
});
