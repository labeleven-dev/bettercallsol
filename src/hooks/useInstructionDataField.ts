import { WritableDraft } from "immer/dist/internal";
import { useContext } from "react";
import { InstructionDataFieldContext } from "../components/client/data/editor/DataEditor";
import {
  DataFormat,
  IInstrctionDataField,
  IInstruction,
} from "../types/internal";
import { IID } from "../types/sortable";
import { useInstruction } from "./useInstruction";

/**
 * Provides the current instruction data's details and methods to interact with it
 */
export const useInstrcutionDataField = (
  format: DataFormat
): {
  id: IID;
  useGet: <U>(select: (account: IInstrctionDataField) => U) => U;
  useShallowGet: <U>(select: (account: IInstrctionDataField) => U) => U;
  update: (fn: (state: WritableDraft<IInstrctionDataField>) => void) => void;
} => {
  const {
    useGet: ixnUseGet,
    useShallowGet: ixnUseShallowGet,
    update: ixnUpdate,
  } = useInstruction();
  const id = useContext(InstructionDataFieldContext);

  const getter = (instruction: IInstruction): IInstrctionDataField => {
    return format === "bufferLayout"
      ? instruction.data.bufferLayout.map[id]
      : instruction.data.borsh.map[id];
  };

  const useGet = <U>(select: (acount: IInstrctionDataField) => U) =>
    ixnUseGet((state) => select(getter(state)));
  const useShallowGet = <U>(select: (acount: IInstrctionDataField) => U) =>
    ixnUseShallowGet((state) => select(getter(state)));

  const update = (fn: (state: WritableDraft<IInstrctionDataField>) => void) => {
    ixnUpdate((state) => {
      fn(getter(state));
    });
  };

  return {
    id,
    useGet,
    useShallowGet,
    update,
  };
};
