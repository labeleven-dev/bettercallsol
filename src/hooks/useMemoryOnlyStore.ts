import produce from "immer";
import create from "zustand";
import { DEFAULT_MEMORY_ONLY_STATE } from "../models/state-default";
import { MemoryOnlyState } from "../models/state-types";

export const useMemoryOnlyState = create<MemoryOnlyState>((set) => ({
  ...DEFAULT_MEMORY_ONLY_STATE,
  set: (fn) => {
    set(produce(fn));
  },
}));
