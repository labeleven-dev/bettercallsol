import { Idl } from "@project-serum/anchor";
import {
  IdlAccount,
  IdlAccountItem,
  IdlInstruction,
} from "@project-serum/anchor/dist/cjs/idl";
import { CompiledInstruction, TransactionResponse } from "@solana/web3.js";
import { mapIInstructionExtToIInstruction } from "./external-mappers";
import { IAccountExt, ITransactionExt } from "./external-types";
import {
  IInstruction,
  IPubKey,
  IRpcEndpoint,
  ITransaction,
} from "./internal-types";
import {
  IAccountSummary,
  IInstructionPreview,
  IPreview,
  PreviewSource,
} from "./preview-types";
import { toSortableCollection } from "./sortable";

/// web3.js <-> Preview ///

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

export const mapTransactionResponseToIPreview = (
  response: TransactionResponse,
  rpcEndpoint: IRpcEndpoint
): IPreview => {
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
    dynamic: true,
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

export const mapITransactionExtToIPreview = (
  { name, dynamic, instructions }: ITransactionExt,
  source: PreviewSource,
  sourceValue: string
): IPreview => {
  return {
    source,
    sourceValue,
    name,
    dynamic,
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

/// Internal <-> Preview ///

export const mapIPreviewToITransaction = ({
  name,
  dynamic,
  instructions,
}: IPreview): ITransaction => ({
  name,
  dynamic,
  instructions: toSortableCollection(
    instructions.map(mapIInstructionPreviewToIInstruction)
  ),
});

/** Imports a preview instruction into the current transaction */
export const mapIInstructionPreviewToIInstruction = (
  instruction: IInstructionPreview
): IInstruction => mapIInstructionExtToIInstruction(instruction);

/// Anchor IDL <-> Preview ///

const mapIdlAccountItemToIAccountExt = (
  account: IdlAccountItem
): IAccountExt | null => {
  if (Object.keys(account).includes("isMut")) {
    const { name, isMut, isSigner } = account as IdlAccount;
    return { name, isWritable: isMut, isSigner };
  } else {
    return null; // TODO support nested accounts
  }
};

const mapIdlInstructionToIInstructionPreview = (
  { name, accounts, args }: IdlInstruction,
  programId: IPubKey
): IInstructionPreview => {
  const mappedAccounts = accounts
    .map(mapIdlAccountItemToIAccountExt)
    .filter((x) => x !== null) as IAccountExt[];

  return {
    name,
    programId,
    accounts: mappedAccounts,
    accountSummary: accountSummary(mappedAccounts),
    data: {
      format: "borsh",
      value: args.map(({ name, type }) => ({
        name,
        type: typeof type === "string" ? type : "unsupported", // TODO support defined, option, etc.
      })),
    },
  };
};

export const mapIdlToIPreview = (
  { name, instructions }: Idl,
  programId: IPubKey,
  rpcEndpoint?: IRpcEndpoint
): IPreview => ({
  source: "anchorProgramId",
  sourceValue: programId,
  dynamic: false,
  rpcEndpoint,
  name,
  instructions: instructions.map((instruction) =>
    mapIdlInstructionToIInstructionPreview(instruction, programId)
  ),
});
