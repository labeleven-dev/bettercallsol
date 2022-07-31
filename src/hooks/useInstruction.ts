import { WritableDraft } from "immer/dist/internal";
import { useContext } from "react";
import { InstructionContext } from "../components/client/Instructions";
import { newAccount, newInstruction } from "../models/internal-mappers";
import { IInstruction } from "../models/internal-types";
import { toSortableCollection } from "../models/sortable";
import { useSessionStoreWithUndo } from "./useSessionStore";

export const useInstruction = () => {
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
    update,
    reset,
  };
};
