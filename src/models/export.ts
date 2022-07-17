// Models for the transaction to be exported

import { IAccount, IPlainText, IPubKey, ITransaction } from "./web3";

export interface IInstructionExport {
  name?: string;
  programId: IPubKey;
  accounts: IAccount[];
  data: IPlainText;
}

export interface ITransactionExport {
  name?: string;
  instructions: IInstructionExport[];
}

const mapToTransactionExport = ({
  name,
  instructionOrder,
  instructions,
}: ITransaction): ITransactionExport => ({
  name,
  instructions: instructionOrder.map((id) => {
    const { name, programId, accountOrder, accounts, data } = instructions[id];
    return {
      name,
      programId,
      accounts: accountOrder.map((id) => accounts[id]),
      data,
    };
  }),
});

// const mapFromTransactionExport = (
//   transaction: ITransactionExport
// ): ITransaction => {
// };

// export const serialiseTransaction = (transaction: ITransaction): string => {};

// export const deserialiseTransaction = (serialised: string): ITransaction => {};
