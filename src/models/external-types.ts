// Models for the transaction to be exported

import {
  DataFormat,
  InstructionDataFieldType,
  IPubKey,
} from "./internal-types";

export interface IInstrctionDataFieldExt {
  name?: string;
  type: InstructionDataFieldType;
  value: any;
}

export interface IAccountExt {
  name?: string;
  pubkey: IPubKey;
  isWritable: boolean;
  isSigner: boolean;
}

export interface IInstructionExt {
  name?: string;
  programId: IPubKey;
  accounts: IAccountExt[];
  data: {
    format: DataFormat;
    value: IInstrctionDataFieldExt[] | string;
  };
}

export interface ITransactionExt {
  name?: string;
  instructions: IInstructionExt[];
}
