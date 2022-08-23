import { WritableDraft } from "immer/dist/internal";
import { useContext } from "react";
import { InstructionContext } from "../components/client/Instructions";
import { IInstruction } from "../types/internal";
import { IID } from "../types/sortable";
import { newInstruction } from "../utils/internal";
import {
  useSessionStoreWithUndo,
  useShallowSessionStoreWithUndo,
} from "./useSessionStore";

/**
 * Provides the current instruction details and methods to interact with it
 */
export const useInstruction = (): {
  id: IID;
  isAnchor: boolean;
  useGet: <U>(select: (instruction: IInstruction) => U) => U;
  useShallowGet: <U>(select: (instruction: IInstruction) => U) => U;
  update: (fn: (state: WritableDraft<IInstruction>) => void) => void;
  reset: () => void;
} => {
  const id = useContext(InstructionContext);
  const useGet = <U>(select: (instruction: IInstruction) => U) =>
    useSessionStoreWithUndo((state) =>
      select(state.transaction.instructions.map[id])
    );
  const useShallowGet = <U>(select: (instruction: IInstruction) => U) =>
    useShallowSessionStoreWithUndo((state) =>
      select(state.transaction.instructions.map[id])
    );

  const anchorMethod = useGet((state) => state.anchorMethod);
  const set = useSessionStoreWithUndo((state) => state.set);

  const update = (fn: (state: WritableDraft<IInstruction>) => void) => {
    set((state) => {
      fn(state.transaction.instructions.map[id]);
    });
  };

  const reset = () => {
    set((state) => {
      state.transaction.instructions.map[id] = {
        ...newInstruction(),
        id,
      };
    });
  };

  return {
    id,
    isAnchor: (anchorMethod?.length || 0) > 0,
    useGet,
    useShallowGet,
    update,
    reset,
  };
};
