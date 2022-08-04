import { CompiledInstruction, TransactionResponse } from "@solana/web3.js";
import { mapIInstructionExtToIInstruction } from "./external-mappers";
import { IAccountExt, ITransactionExt } from "./external-types";
import { IInstruction, IRpcEndpoint } from "./internal-types";
import {
  IAccountSummary,
  IInstructionPreview,
  ITransactionPreview,
  PreviewSource,
} from "./preview-types";

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
export const mapTransactionResponseToITransactionPreview = (
  response: TransactionResponse,
  rpcEndpoint: IRpcEndpoint
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
      data: {
        format: "raw",
        value: data,
      },
      accountSummary: accountSummary(mappedAccounts),
    };
  };

  return {
    source: "tx",
    sourceValue: response.transaction.signatures[0],
    rpcEndpoint,
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

export const mapITransactionExtToITransactionPreview = (
  { name, instructions }: ITransactionExt,
  source: PreviewSource,
  sourceValue: string
): ITransactionPreview => {
  return {
    source,
    sourceValue,
    name,
    instructions: instructions.map((instruction) => ({
      ...instruction,
      accountSummary: accountSummary(instruction.accounts),
    })),
  };
};

const accountSummary = (accounts: IAccountExt[]): IAccountSummary => ({
  total: accounts.length,
  writableSigner: accounts.filter((x) => x.isSigner && x.isWritable).length,
  readonlySigner: accounts.filter((x) => x.isSigner && !x.isWritable).length,
  writableUnsigned: accounts.filter((x) => !x.isSigner && x.isWritable).length,
  readonlyUsigned: accounts.filter((x) => !x.isSigner && !x.isWritable).length,
});

/** Imports a preview instruction into the current transaction */
export const mapIInstructionPreviewToIInstruction = (
  instruction: IInstructionPreview
): IInstruction => ({
  ...mapIInstructionExtToIInstruction(instruction),
  name: "Imported Instruction",
});
