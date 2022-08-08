import { DataFormat, InstructionDataFieldType } from "./internal-types";
import { Explorer } from "./state-types";

// for explorer option drop-down
export const EXPLORERS: { id: Explorer; name: string }[] = [
  { id: "solana", name: "Solana Explorer" },
  { id: "solanaBeach", name: "Solana Beach" },
  { id: "solanafm", name: "SolanaFM" },
  { id: "solscan", name: "Solscan" },
  { id: "none", name: "None" },
];

// for commitment level option drop-downs
export const COMMITMENT_LEVELS = [
  { id: "processed", name: "Processed" },
  { id: "confirmed", name: "Confirmed" },
  { id: "finalized", name: "Finalized" },
  { id: "recent", name: "Recent" },
  { id: "single", name: "Single" },
  { id: "singleGossip", name: "Single Gossip" },
  { id: "root", name: "Root" },
  { id: "max", name: "Max" },
];

// for the data type drop-down
export const FORMAT_DATA_TYPES: Record<DataFormat, InstructionDataFieldType[]> =
  {
    borsh: [
      "u8",
      "i8",
      "u16",
      "i16",
      "u32",
      "i32",
      "u64",
      "i64",
      "bool",
      "publicKey",
      "string",
      "unsupported",
    ],
    bufferLayout: [
      "u8",
      "i8",
      "u16",
      "i16",
      "u32",
      "i32",
      "u64",
      "i64",
      "f32",
      "f64",
      "bool",
      "bytes",
      "publicKey",
      "string",
      "unsupported",
    ],
    raw: [],
  };

// for detecting types that require a number input
export const NUMERICAL_DATA_TYPES: InstructionDataFieldType[] = [
  "u8",
  "i8",
  "u16",
  "i16",
  "u32",
  "i32",
  "u64",
  "i64",
  "u128",
  "i128",
  "f32",
  "f64",
];
