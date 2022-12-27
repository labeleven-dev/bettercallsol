// Models for transactions fetched from the chain, as part of import

import { TransactionVersion } from "@solana/web3.js";
import { IInstructionExt } from "./external";
import { IRpcEndpoint } from "./internal";

export interface IAccountSummary {
  total: number;
  writableSigner: number;
  readonlySigner: number;
  writableUnsigned: number;
  readonlyUsigned: number;
}

export interface IInstructionPreview
  extends Omit<IInstructionExt, "anchorMethod" | "anchorAccounts"> {
  accountSummary: IAccountSummary;
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
  accountSummary?: IAccountSummary; // only set in source=tx
  fee?: number;
  error?: string;
}
