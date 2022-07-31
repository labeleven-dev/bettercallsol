// The internal common model
// Use as intermediate for other models and for tracking transaction state in the app

import { Commitment, TransactionConfirmationStatus } from "@solana/web3.js";
import { IID, SortableCollection } from "./sortable";

export type IPubKey = string;

export interface IAccount {
  id: IID;
  name?: string;
  pubkey: IPubKey;
  isWritable: boolean;
  isSigner: boolean;
}

export type InstructionDataFieldType =
  | "u8"
  | "i8"
  | "u16"
  | "i16"
  | "u32"
  | "i32"
  | "u64"
  | "i64"
  // | "u128"
  // | "i128"
  | "bool"
  | "publicKey"
  | "string";

export interface IInstrctionDataField {
  id: IID;
  name?: string;
  type: InstructionDataFieldType;
  value: any;
}

export type DataFormat = "raw" | "bufferLayout" | "borsh";

export interface IInstructionData {
  format: DataFormat;
  raw: string;
  borsh: SortableCollection<IInstrctionDataField>;
  bufferLayout: SortableCollection<IInstrctionDataField>;
}

export interface IInstruction {
  id: IID;
  name?: string;
  programId: IPubKey;
  accounts: SortableCollection<IAccount>;
  data: IInstructionData;

  // UI state
  readonly disabled: boolean;
  readonly expanded: boolean;
}

export type INetwork = "local" | "devnet" | "testnet" | "mainnet-beta";

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
  instructions: SortableCollection<IInstruction>;
}

export interface IBalance {
  address: string;
  before: number;
  after: number;
}

export interface IResults {
  inProgress: boolean;
  signature: string; // not optional to work-around uncontrolled input issue
  startedAt?: number;
  slot?: number;
  confirmations?: number;
  confirmationStatus?: TransactionConfirmationStatus;
  finalisedAt?: number;
  blockTime?: number;
  fee?: number;
  balances?: IBalance[];
  error?: string;
  logs?: string[];
}

export interface ICommitment {
  id: Commitment;
  name: string;
}

export interface ITransactionOptions {
  rpcEndpoint: IRpcEndpoint;
  skipPreflight: boolean;
  commitment: Commitment;
  maxRetries: number;
  preflightCommitment?: Commitment;
  disableRetryOnRateLimit: boolean;
  confirmTransactionInitialTimeout: number;
  confirmTransactionTimeout: number;
  pollingPeriod: number; // used in our app, rather than passed to web3.js stuff
}