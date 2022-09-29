// Models for the transaction to be exported

import {
  DataFormat,
  IAccount,
  IAccountMetadata,
  IInstrctionDataField,
  IInstructionDataRaw,
  INetwork,
  IPubKey,
} from "./internal";

export type IInstrctionDataFieldExt = Omit<IInstrctionDataField, "id">;

export type IAccountExt = Omit<IAccount, "id">;

export interface IInstructionDataExt {
  format: DataFormat;
  value: IInstrctionDataFieldExt[] | IInstructionDataRaw;
}

export interface IInstructionExt {
  name?: string;
  description?: string;
  programId: IPubKey;
  programMetadata?: IAccountMetadata;
  accounts: IAccountExt[];
  data: IInstructionDataExt;
  anchorMethod?: string;
  anchorAccounts?: IAccountExt[];
}

export interface ITransactionExt {
  version: string;
  network: INetwork;
  name?: string;
  description?: string;
  instructions: IInstructionExt[];
}
