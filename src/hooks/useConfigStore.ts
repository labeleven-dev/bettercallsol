import produce from "immer";
import create from "zustand";
import { persist } from "zustand/middleware";
import shallow from "zustand/shallow";
import { PersistentState } from "../types/state";
import { DEFAULT_PERSISTENT_STATE } from "../utils/state";

/**
 * Provides access to the LocalStorage Zustand store
 */
export const useConfigStore = create<PersistentState>()(
  persist(
    (set) => ({
      ...DEFAULT_PERSISTENT_STATE,
      set: (fn) => {
        set(produce(fn));
      },
    }),
    {
      name: "bcsol-config",
      version: 1,
    }
  )
);

export const useShallowConfigStore = <U>(
  selector: (state: PersistentState) => U
) => useConfigStore(selector, shallow);
