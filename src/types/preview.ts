// Models for transactions fetched from the chain, as part of import

import { TransactionVersion } from "@solana/web3.js";
import { IInstructionExt } from "./external";
import { IPubKey, IRpcEndpoint } from "./internal";

export interface ITransactionAccountSummary {
  staticKeys: number;
  lookupTables: number;
  writableLookup: number;
  readonlyLookup: number;
  signatures: number;
  readonlySigned: number;
  readonlyUnsigned: number;
}

export interface IInstructionAccountSummary {
  total: number;
  writableSigner: number;
  readonlySigner: number;
  writableUnsigned: number;
  readonlyUsigned: number;
}

export interface IInstructionPreview
  extends Omit<IInstructionExt, "anchorMethod" | "anchorAccounts"> {
  accountSummary: IInstructionAccountSummary;
  innerInstructions?: IInstructionPreview[];
}

export type PreviewSource =
  | "tx"
  | "shareUrl"
  | "shareJson"
  | "anchorProgramId"
  | "anchorJson";

export interface IPreview {
  source: PreviewSource;
  sourceValue: string; // could transaction ID, URL, file path, etc.
  version: TransactionVersion;
  name?: string;
  description?: string;
  rpcEndpoint?: IRpcEndpoint;
  instructions: IInstructionPreview[];
  accountSummary?: ITransactionAccountSummary; // only set in source=tx
  fee?: number;
  error?: string;
  addressLookupTables: IPubKey[];
}
