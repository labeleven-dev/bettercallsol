import { v4 as uuid } from "uuid";
import {
  IAccount,
  IInstrctionDataField,
  IInstruction,
  IInstructionData,
  IRpcEndpoint,
} from "./internal-types";
import { toSortableCollection } from "./sortable";

///// Initialisers /////

export const newRpcEndpoint = (): IRpcEndpoint => ({
  id: uuid(),
  provider: "",
  network: "devnet",
  url: "",
  enabled: true,
  custom: true,
});

export const newDataField = (): IInstrctionDataField => ({
  id: uuid(),
  name: "",
  type: "string",
  value: "",
});

export const newAccount = (): IAccount => ({
  id: uuid(),
  pubkey: "",
  isSigner: false,
  isWritable: false,
});

export const EMPTY_INSTRUCTION_DATA: IInstructionData = {
  format: "raw",
  raw: "",
  borsh: toSortableCollection([]),
  bufferLayout: toSortableCollection([]),
};

export const newInstruction = (): IInstruction => ({
  id: uuid(),
  name: "",
  programId: "",
  accounts: { map: {}, order: [] },
  data: EMPTY_INSTRUCTION_DATA,
  disabled: false,
  expanded: true,
});
