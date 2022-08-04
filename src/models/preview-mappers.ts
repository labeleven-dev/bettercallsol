import { CompiledInstruction, TransactionResponse } from "@solana/web3.js";
import {
  EMPTY_INSTRUCTION_DATA,
  newAccount,
  newInstruction,
} from "./internal-mappers";
import { IInstruction, IRpcEndpoint } from "./internal-types";
import {
  IAccountPreview,
  IAccountSummary,
  IInstructionPreview,
  ITransactionPreview,
} from "./preview-types";
import { toSortableCollection } from "./sortable";

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
export const mapFromTransactionResponse = (
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
      data,
      accountSummary: accountSummary(mappedAccounts),
    };
  };

  return {
    signature: response.transaction.signatures[0],
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
}: IInstructionPreview): IInstruction => ({
  ...newInstruction(),
  name: "Imported Instruction",
  programId,
  accounts: toSortableCollection(
    accounts.map(({ pubkey, isWritable, isSigner }) => ({
      ...newAccount(),
      pubkey,
      isSigner,
      isWritable,
    }))
  ),
  data: {
    ...EMPTY_INSTRUCTION_DATA,
    format: "raw",
    raw: data,
  },
});
