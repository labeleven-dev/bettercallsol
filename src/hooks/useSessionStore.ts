import produce from "immer";
import create from "zustand";
import { DEFAULT_SESSION_STATE } from "../models/state-default";
import { SessionState } from "../models/state-types";

// TODO implement undo/redo once this is resolved: https://github.com/charkour/zundo/issues/38

export const useSessionStore = create<SessionState>((set) => ({
  ...DEFAULT_SESSION_STATE,
  set: (fn) => {
    set(produce(fn));
  },
}));
