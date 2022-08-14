import { WritableDraft } from "immer/dist/internal";
import { useContext } from "react";
import { InstructionContext } from "../components/client/Instructions";
import { IInstruction } from "../types/internal";
import { newAccount, newInstruction } from "../utils/internal";
import { toSortableCollection } from "../utils/sortable";
import { useSessionStoreWithUndo } from "./useSessionStore";

export const useInstruction = (): {
  instruction: IInstruction;
  isAnchor: boolean;
  update: (fn: (state: WritableDraft<IInstruction>) => void) => void;
  reset: () => void;
} => {
  const instruction = useContext(InstructionContext);
  const set = useSessionStoreWithUndo((state) => state.set);

  const update = (fn: (state: WritableDraft<IInstruction>) => void) => {
    set((state) => {
      fn(state.transaction.instructions.map[instruction.id]);
    });
  };

  const reset = () => {
    set((state) => {
      state.transaction.instructions.map[instruction.id] = {
        ...newInstruction(),
        id: instruction.id,
        accounts: toSortableCollection([newAccount()]),
      };
    });
  };

  return {
    instruction,
    isAnchor: (instruction.anchorMethod?.length || 0) > 0,
    update,
    reset,
  };
};
