import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import {
  CompiledInstruction,
  MessageCompiledInstruction,
  VersionedTransactionResponse,
} from "@solana/web3.js";
import { mapWeb3TransactionError } from "mappers/web3js-to-internal";
import { IAccountExt } from "types/external";
import { IRpcEndpoint } from "types/internal";
import { IAccountSummary, IInstructionPreview, IPreview } from "types/preview";

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
  const { version, staticAccountKeys, compiledInstructions } =
    response.transaction.message;

  const parsedAccountKeys: IAccountExt[] = staticAccountKeys.map(
    (account, index) => ({
      type: "unspecified",
      pubkey: account.toBase58(),
      isSigner: response.transaction.message.isAccountSigner(index),
      isWritable: response.transaction.message.isAccountWritable(index),
    })
  );

  const mapInstruction = ({
    programIdIndex,
    accountKeyIndexes,
    data,
  }: MessageCompiledInstruction): IInstructionPreview => {
    const mappedAccounts = accountKeyIndexes.map(
      (index) => parsedAccountKeys[index]
    );
    return {
      programId: staticAccountKeys[programIdIndex].toBase58(),
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
    const mappedAccounts = accounts.map((index) => parsedAccountKeys[index]);
    return {
      programId: staticAccountKeys[programIdIndex].toBase58(),
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

  return {
    source: "tx",
    sourceValue: response.transaction.signatures[0],
    version,
    rpcEndpoint,
    accountSummary: accountSummary(parsedAccountKeys),
    fee: response.meta?.fee,
    error: mapWeb3TransactionError(response.meta?.err),
    instructions: compiledInstructions.map((instruction, ixnIndex) => ({
      ...mapInstruction(instruction),
      innerInstructions: response.meta?.innerInstructions
        ?.find(({ index }) => index === ixnIndex)
        ?.instructions.map((ixn) => mapInnerInstruction(ixn)),
    })),
  };
};

export const accountSummary = (accounts: IAccountExt[]): IAccountSummary => ({
  total: accounts.length,
  writableSigner: accounts.filter((x) => x.isSigner && x.isWritable).length,
  readonlySigner: accounts.filter((x) => x.isSigner && !x.isWritable).length,
  writableUnsigned: accounts.filter((x) => !x.isSigner && x.isWritable).length,
  readonlyUsigned: accounts.filter((x) => !x.isSigner && !x.isWritable).length,
});
