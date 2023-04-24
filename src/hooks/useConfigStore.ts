import produce from "immer";
import { PersistentState } from "types/state";
import { DEFAULT_PERSISTENT_STATE } from "utils/state";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { shallow } from "zustand/shallow";

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
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useShallowConfigStore = <U>(
  selector: (state: PersistentState) => U
) => useConfigStore(selector, shallow);
