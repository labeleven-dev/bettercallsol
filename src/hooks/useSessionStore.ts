import produce from "immer";
import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { SessionStateWithoutUndo, SessionStateWithUndo } from "../types/state";
import {
  DEFAULT_SESSION_STATE_WITHOUT_UNDO,
  DEFAULT_SESSION_STATE_WITH_UNDO,
} from "../utils/state";

// TODO implement undo/redo once this is resolved: https://github.com/charkour/zundo/issues/38

export const useSessionStoreWithUndo = create<SessionStateWithUndo>((set) => ({
  ...DEFAULT_SESSION_STATE_WITH_UNDO,
  set: (fn) => {
    set(produce(fn));
  },
}));

export const useSessionStoreWithoutUndo = create<SessionStateWithoutUndo>()(
  subscribeWithSelector((set) => ({
    ...DEFAULT_SESSION_STATE_WITHOUT_UNDO,
    set: (fn) => {
      set(produce(fn));
    },
  }))
);
