import { UseToastOptions } from "@chakra-ui/react";
import { Commitment, Finality, TransactionVersion } from "@solana/web3.js";
import { DataFormat, InstructionDataFieldType } from "types/internal";
import { Explorer } from "types/state";

export const SIMULATED_SIGNATURE = "<simulated>";

export const DEFAULT_ERROR_MODAL: UseToastOptions = {
  status: "error",
  duration: 8000,
  isClosable: true,
};

// for explorer option drop-down
export const EXPLORERS: { id: Explorer; name: string }[] = [
  { id: "solana", name: "Solana Explorer" },
  { id: "solanaBeach", name: "Solana Beach" },
  { id: "solanafm", name: "SolanaFM" },
  { id: "solscan", name: "Solscan" },
  { id: "none", name: "None" },
];

// for commitment level option drop-downs
export const COMMITMENT_LEVELS: { id: Commitment; name: string }[] = [
  { id: "processed", name: "Processed" },
  { id: "confirmed", name: "Confirmed" },
  { id: "finalized", name: "Finalized" },
  { id: "recent", name: "Recent" },
  { id: "single", name: "Single" },
  { id: "singleGossip", name: "Single Gossip" },
  { id: "root", name: "Root" },
  { id: "max", name: "Max" },
];

// for finality level option drop-downs
export const FINALITY_LEVELS: { id: Finality; name: string }[] = [
  { id: "confirmed", name: "Confirmed" },
  { id: "finalized", name: "Finalized" },
];

// for transaction version drop-down
export const TRANSACTION_VERSIONS: {
  id: TransactionVersion;
  name: string;
  description: string;
}[] = [
  { id: "legacy", name: "Legacy", description: "The OG" },
  { id: 0, name: "v0", description: "Address Lookup Table" },
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
      "bytes",
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
      "publicKey",
      // TODO underbaked - needs to support various types of String encodings
      // "string",
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
