// The internal common model
// Use as intermediate for other models and for tracking transaction state in the app

import {
  Commitment,
  Finality,
  TransactionConfirmationStatus,
  TransactionVersion,
} from "@solana/web3.js";
import { IID, SortableCollection } from "./sortable";

export type IPubKey = string;

export type AccountType =
  | "unspecified"
  | "wallet"
  | "keypair"
  | "pda"
  | "ata"
  | "program"
  | "sysvar";

export interface IAccountMetadata {
  name?: string;
  mint?: IPubKey;
  seeds?: any[];
  bump?: number;
}

export interface IAccount {
  id: IID;
  type: AccountType;
  name?: string;
  description?: string;
  pubkey: IPubKey;
  isWritable: boolean;
  isSigner: boolean;
  metadata?: IAccountMetadata;
}

export type InstructionDataFieldType =
  | "u8"
  | "i8"
  | "u16"
  | "i16"
  | "u32"
  | "i32"
  | "f32"
  | "u64"
  | "i64"
  | "f64"
  | "u128"
  | "i128"
  | "bool"
  | "bytes"
  | "publicKey"
  | "string"
  | "unsupported";

export interface IInstrctionDataField {
  id: IID;
  name?: string;
  description?: string;
  type: InstructionDataFieldType;
  value: any;
}

export type DataFormat = "raw" | "bufferLayout" | "borsh";

export type RawEncoding = "hex" | "bs58";

export interface IInstructionDataRaw {
  content: string;
  encoding: RawEncoding;
  description?: string;
}

export interface IInstructionData {
  format: DataFormat;
  raw: IInstructionDataRaw;
  borsh: SortableCollection<IInstrctionDataField>;
  bufferLayout: SortableCollection<IInstrctionDataField>;
}

export interface IInstruction {
  id: IID;
  name?: string;
  description?: string;
  programId: IPubKey;
  programMetadata?: IAccountMetadata;

  accounts: SortableCollection<IAccount>;
  data: IInstructionData;

  // Anchor-specific
  anchorMethod?: string;
  anchorAccounts?: IAccount[];
  // `accounts` field above is treated as "remaining accounts"
  // if this is an Anchor instruction

  // UI state
  readonly disabled: boolean;
  readonly expanded: boolean;
}

export type INetwork = "custom" | "devnet" | "testnet" | "mainnet-beta";

export interface IRpcEndpoint {
  id: IID;
  provider: string;
  network: INetwork;
  url: string;
  enabled: boolean;
  custom: boolean;
}

export interface ITransaction {
  name?: string;
  description?: string;
  version: TransactionVersion;
  instructions: SortableCollection<IInstruction>;
  addressLookupTables: IPubKey[];
}

export interface IBalance {
  address: string;
  before: number;
  after: number;
}

export interface ITransactionRun {
  inProgress: boolean;
  signature: string; // not optional to work-around uncontrolled input issue
  error?: string;
  slot?: number;
  confirmations?: number;
  confirmationStatus?: TransactionConfirmationStatus | "simulated";
  blockTime?: number;
  fee?: number;
  balances?: IBalance[];
  logs?: string[];
  unitsConsumed?: number;
}

export interface ICommitment {
  id: Commitment;
  name: string;
}

export interface ITransactionOptions {
  skipPreflight: boolean;
  finality: Finality;
  maxRetries: number;
  preflightCommitment?: Commitment;
  disableRetryOnRateLimit: boolean;
  confirmTransactionInitialTimeout: number;
  confirmTransactionTimeout: number;
  pollingPeriod: number; // used in our app, rather than passed to web3.js stuff
  signVerifySimulation: boolean;
}
