import { CompiledInstruction, TransactionResponse } from "@solana/web3.js";
import { IAccountExt } from "../types/external";
import { IRpcEndpoint } from "../types/internal";
import {
  IAccountSummary,
  IInstructionPreview,
  IPreview,
} from "../types/preview";
import { mapWeb3TransactionError } from "./web3js-to-internal";

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

  const parsedAccountKeys: IAccountExt[] = accountKeys.map(
    (account, index) => ({
      type: { type: "unspecified" },
      pubkey: account.toBase58(),
      isSigner: response.transaction.message.isAccountSigner(index),
      isWritable: response.transaction.message.isAccountWritable(index),
    })
  );

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
    error: mapWeb3TransactionError(response.meta?.err),
    instructions: instructions.map((instruction, ixnIndex) => ({
      ...mapInstruction(instruction),
      innerInstructions: response.meta?.innerInstructions
        ?.find(({ index }) => index === ixnIndex)
        ?.instructions.map((ixn) => mapInstruction(ixn)),
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
