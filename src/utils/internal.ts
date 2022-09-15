import { v4 as uuid } from "uuid";
import {
  IAccount,
  IInstrctionDataField,
  IInstruction,
  IInstructionData,
  INetwork,
  IRpcEndpoint,
} from "../types/internal";
import { toSortableCollection } from "./sortable";

export const ALL_NETWORKS: INetwork[] = ["devnet", "testnet", "mainnet-beta"];
export const LIVE_NETWORKS: INetwork[] = ["devnet", "testnet", "mainnet-beta"];

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
  type: "u8",
  value: "",
});

export const newAccount = (): IAccount => ({
  id: uuid(),
  type: "unspecified",
  pubkey: "",
  isSigner: false,
  isWritable: false,
});

export const EMPTY_INSTRUCTION_DATA: IInstructionData = {
  format: "raw",
  raw: {
    content: "",
    encoding: "bs58",
  },
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
