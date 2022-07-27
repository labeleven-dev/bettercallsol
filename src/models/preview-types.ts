// Models for transactions fetched from the chain, as part of import

import { IPubKey, IRpcEndpoint } from "./internal-types";

export interface IAccountSummary {
  total: number;
  writableSigner: number;
  readonlySigner: number;
  writableUnsigned: number;
  readonlyUsigned: number;
}

export interface IAccountPreview {
  pubkey: IPubKey;
  isWritable: boolean;
  isSigner: boolean;
}

export interface IInstructionPreview {
  programId: IPubKey;
  accounts: IAccountPreview[];
  data: string;
  accountSummary: IAccountSummary;
  innerInstructions?: IInstructionPreview[];
}

export interface ITransactionPreview {
  signature: IPubKey;
  rpcEndpoint: IRpcEndpoint;
  instructions: IInstructionPreview[];
  accountSummary: IAccountSummary;
  fee?: number;
  error?: string;
}
