import produce from "immer";
import { SessionStateWithoutUndo, SessionStateWithUndo } from "types/state";
import {
  DEFAULT_SESSION_STATE_WITH_UNDO,
  DEFAULT_SESSION_STATE_WITHOUT_UNDO,
} from "utils/state";
import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from "zustand/middleware";
import { shallow } from "zustand/shallow";

// TODO implement undo/redo once this is resolved: https://github.com/charkour/zundo/issues/38

/**
 * Provides access to in-memory Zustand store, for state that can be undo/redo'ed
 */
export const useSessionStoreWithUndo = create<SessionStateWithUndo>()(
  persist(
    (set) => ({
      ...DEFAULT_SESSION_STATE_WITH_UNDO,
      set: (fn) => {
        set(produce(fn));
      },
    }),
    {
      name: "bscol-with-undo",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        ...state,
        lastUpdatedAt: new Date().getTime(),
      }),
    }
  )
);

export const useShallowSessionStoreWithUndo = <U>(
  selector: (state: SessionStateWithUndo) => U
) => useSessionStoreWithUndo(selector, shallow);

/**
 * Provides access to in-memory Zustand store, for state that should not be undo/redo'ed
 */
export const useSessionStoreWithoutUndo = create<SessionStateWithoutUndo>()(
  persist(
    subscribeWithSelector((set) => ({
      ...DEFAULT_SESSION_STATE_WITHOUT_UNDO,
      set: (fn) => {
        set(produce(fn));
      },
    })),
    {
      name: "bscol-without-undo",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const useShallowSessionStoreWithoutUndo = <U>(
  selector: (state: SessionStateWithoutUndo) => U
) => useSessionStoreWithoutUndo(selector, shallow);
