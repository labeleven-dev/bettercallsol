import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import {
  CompiledInstruction,
  MessageCompiledInstruction,
  VersionedTransactionResponse,
} from "@solana/web3.js";
import { mapWeb3TransactionError } from "mappers/web3js-to-internal";
import { IAccountExt } from "types/external";
import { IRpcEndpoint } from "types/internal";
import {
  IInstructionAccountSummary,
  IInstructionPreview,
  IPreview,
} from "types/preview";

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
  response: VersionedTransactionResponse,
  rpcEndpoint: IRpcEndpoint
): IPreview => {
  const message = response.transaction.message;
  const accountKeys = message.getAccountKeys({
    accountKeysFromLookups: response.meta?.loadedAddresses,
  });

  const getParsedAccount = (index: number): IAccountExt => {
    const account = accountKeys.get(index);
    if (!account) {
      throw new Error(
        `Invalid transaction: Cannot find account key for index ${index}`
      );
    }
    return {
      type: "unspecified", // TODO infer other types like wallet
      pubkey: account?.toBase58(),
      isSigner: response.transaction.message.isAccountSigner(index),
      isWritable: response.transaction.message.isAccountWritable(index),
    };
  };

  const mapInstruction = ({
    programIdIndex,
    accountKeyIndexes,
    data,
  }: MessageCompiledInstruction): IInstructionPreview => {
    const mappedAccounts = accountKeyIndexes.map(getParsedAccount);
    return {
      programId: getParsedAccount(programIdIndex).pubkey,
      accounts: mappedAccounts,
      data: {
        format: "raw",
        value: {
          content: bs58.encode(data),
          encoding: "bs58",
        },
      },
      accountSummary: accountSummary(mappedAccounts),
    };
  };

  const mapInnerInstruction = ({
    programIdIndex,
    accounts,
    data,
  }: CompiledInstruction): IInstructionPreview => {
    const mappedAccounts = accounts.map(getParsedAccount);
    return {
      programId: getParsedAccount(programIdIndex).pubkey,
      accounts: mappedAccounts,
      data: {
        format: "raw",
        value: {
          content: data,
          encoding: "bs58",
        },
      },
      accountSummary: accountSummary(mappedAccounts),
    };
  };

  const instructions = message.compiledInstructions.map(
    (instruction, ixnIndex) => ({
      ...mapInstruction(instruction),
      innerInstructions: response.meta?.innerInstructions
        ?.find(({ index }) => index === ixnIndex)
        ?.instructions.map((ixn) => mapInnerInstruction(ixn)),
    })
  );

  return {
    source: "tx",
    sourceValue: response.transaction.signatures[0],
    version: message.version,
    rpcEndpoint,
    accountSummary: {
      staticKeys: message.staticAccountKeys.length,
      signatures: message.header.numRequiredSignatures,
      readonlySigned: message.header.numReadonlySignedAccounts,
      readonlyUnsigned: message.header.numReadonlyUnsignedAccounts,
      lookupTables: message.addressTableLookups.length,
      writableLookup: response.meta?.loadedAddresses?.writable?.length || 0,
      readonlyLookup: response.meta?.loadedAddresses?.readonly?.length || 0,
    },
    fee: response.meta?.fee,
    error: mapWeb3TransactionError(response.meta?.err),
    instructions,
    addressLookupTables: message.addressTableLookups.map(({ accountKey }) =>
      accountKey.toBase58()
    ),
  };
};

export const accountSummary = (
  accounts: IAccountExt[]
): IInstructionAccountSummary => ({
  total: accounts.length,
  writableSigner: accounts.filter((x) => x.isSigner && x.isWritable).length,
  readonlySigner: accounts.filter((x) => x.isSigner && !x.isWritable).length,
  writableUnsigned: accounts.filter((x) => !x.isSigner && x.isWritable).length,
  readonlyUsigned: accounts.filter((x) => !x.isSigner && !x.isWritable).length,
});
