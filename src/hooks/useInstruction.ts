import { WritableDraft } from "immer/dist/internal";
import { useContext } from "react";
import { InstructionContext } from "../components/client/Instructions";
import { newInstruction } from "../models/internal-mappers";
import { IInstruction } from "../models/internal-types";
import { DEFAULT_UI_INSTRUCTION_STATE } from "../models/state-default";
import { UIInstructionState } from "../models/state-types";
import { useTransactionStore } from "./useTransactionStore";

export const useInstruction = () => {
  const instruction = useContext(InstructionContext);
  const uiState = useTransactionStore(
    (state) => state.uiState.instructions[instruction.id]
  );
  const set = useTransactionStore((state) => state.set);

  const update = (fn: (state: WritableDraft<IInstruction>) => void) => {
    set((state) => {
      fn(state.transaction.instructions.map[instruction.id]);
    });
  };

  const updateUi = (fn: (state: WritableDraft<UIInstructionState>) => void) => {
    set((state) => {
      fn(state.uiState.instructions[instruction.id]);
    });
  };

  const reset = () => {
    set((state) => {
      state.transaction.instructions.map[instruction.id] = {
        ...newInstruction(),
        id: instruction.id,
      };
      state.uiState.instructions[instruction.id] = DEFAULT_UI_INSTRUCTION_STATE;
    });
  };

  return {
    instruction,
    uiState,
    update,
    updateUi,
    reset,
  };
};
