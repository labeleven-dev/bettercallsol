// Models for transactions fetched from the chain, as part of import

import { CompiledInstruction, TransactionResponse } from "@solana/web3.js";
import {
  IAccount,
  IID,
  IInstruction,
  INetwork,
  IPlainText,
  IPubKey,
  newAccount,
  newInstruction,
} from "./web3";

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
  data: IPlainText;
  accountSummary: IAccountSummary;
  innerInstructions?: IInstructionPreview[];
}

export interface ITransactionPreview {
  signature: IPubKey;
  network: INetwork;
  instructions: IInstructionPreview[];
  accountSummary: IAccountSummary;
  fee?: number;
  error?: string;
}

// TODO getParsedTransaction has some more info for specific instructions
// {
//   "parsed": {
//     "info": {
//       "amount": "561999961",
//       "authority": "HLmpbUYj92oapJsdgoi1Mfy9BacEXzWbZ5t2FFQ3cJ6b",
//       "destination": "CfWX7o2TswwbxusJ4hCaPobu2jLCb1hfXuXJQjVq3jQF",
//       "source": "DyNHsWUzSgDvHVExM77aTAvpZeqK5qta53SGQif3ymbD"
//     },
//     "type": "transfer"
//   },
//   "program": "spl-token",
//   "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
// },

/** Maps a web3.js transaction from the chain into a transaction preview, suitable for importing **/
export const mapToTransactionPreview = (
  response: TransactionResponse,
  network: INetwork
): ITransactionPreview => {
  const { accountKeys, instructions } = response.transaction.message;

  const parsedAccountKeys = accountKeys.map((account, index) => ({
    pubkey: account.toBase58(),
    isSigner: response.transaction.message.isAccountSigner(index),
    isWritable: response.transaction.message.isAccountWritable(index),
  }));

  const mapInstruction = ({
    programIdIndex,
    accounts,
    data,
  }: CompiledInstruction): IInstructionPreview => {
    const mappedAccounts = accounts.map((index) => parsedAccountKeys[index]);
    return {
      programId: accountKeys[programIdIndex].toBase58(),
      accounts: mappedAccounts,
      data,
      accountSummary: accountSummary(mappedAccounts),
    };
  };

  return {
    signature: response.transaction.signatures[0],
    network,
    accountSummary: accountSummary(parsedAccountKeys),
    fee: response.meta?.fee,
    error: (response.meta?.err as string) || undefined,
    instructions: instructions.map((instruction, ixnIndex) => ({
      ...mapInstruction(instruction),
      innerInstructions: response.meta?.innerInstructions
        ?.find(({ index }) => index === ixnIndex)
        ?.instructions.map((ixn) => mapInstruction(ixn)),
    })),
  };
};

const accountSummary = (accounts: IAccountPreview[]): IAccountSummary => ({
  total: accounts.length,
  writableSigner: accounts.filter((x) => x.isSigner && x.isWritable).length,
  readonlySigner: accounts.filter((x) => x.isSigner && !x.isWritable).length,
  writableUnsigned: accounts.filter((x) => !x.isSigner && x.isWritable).length,
  readonlyUsigned: accounts.filter((x) => !x.isSigner && !x.isWritable).length,
});

/** Imports a preview instruction into the current transaction */
export const mapToIInstruction = ({
  programId,
  accounts,
  data,
}: IInstructionPreview): IInstruction => {
  const mappedAccounts: Record<IID, IAccount> = {};
  const accountOrder: IID[] = [];

  accounts.forEach(({ pubkey, isWritable, isSigner }) => {
    const account = {
      ...newAccount(),
      pubkey,
      isSigner,
      isWritable,
    };
    mappedAccounts[account.id] = account;
    accountOrder.push(account.id);
  });

  return {
    ...newInstruction(),
    name: "Imported Instruction",
    programId,
    accounts: mappedAccounts,
    accountOrder,
    data,
  };
};
