import { WritableDraft } from "immer/dist/internal";
import { useContext } from "react";
import { InstructionContext } from "../components/client/Instructions";
import {
  DEFAULT_UI_INSTRUCTION_STATE,
  UIInstructionState,
} from "../models/state";
import { IInstruction, newInstruction } from "../models/web3";
import { useTransactionStore } from "./useTransactionStore";

export const useInstruction = () => {
  const instruction = useContext(InstructionContext);
  const uiState = useTransactionStore(
    (state) => state.uiState.instructions[instruction.id]
  );
  const setTransaction = useTransactionStore((state) => state.set);

  const update = (fn: (state: WritableDraft<IInstruction>) => void) => {
    setTransaction((state) => {
      fn(state.transaction.instructions.map[instruction.id]);
    });
  };

  const updateUi = (fn: (state: WritableDraft<UIInstructionState>) => void) => {
    setTransaction((state) => {
      fn(state.uiState.instructions[instruction.id]);
    });
  };

  const reset = () => {
    setTransaction((state) => {
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
