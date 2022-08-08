// Models for transactions fetched from the chain, as part of import

import { IInstructionExt } from "./external-types";
import { IRpcEndpoint } from "./internal-types";

export interface IAccountSummary {
  total: number;
  writableSigner: number;
  readonlySigner: number;
  writableUnsigned: number;
  readonlyUsigned: number;
}

export interface IInstructionPreview extends IInstructionExt {
  accountSummary: IAccountSummary;
  innerInstructions?: IInstructionPreview[];
}

export type PreviewSource = "tx" | "shareUrl" | "shareJson" | "anchorProgramId"; // TODO file, anchorIdlUrl, anchorIdlFile, etc.

export interface IPreview {
  source: PreviewSource;
  sourceValue: string; // could transaction ID, URL, file path, etc.
  name?: string;
  description?: string;
  rpcEndpoint?: IRpcEndpoint;
  instructions: IInstructionPreview[];
  accountSummary?: IAccountSummary; // only set in source=tx
  fee?: number;
  error?: string;
}
