import {
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  TransactionInstruction,
  TransactionResponse,
} from "@solana/web3.js";
import BigNumber from "bignumber.js";
import bs58 from "bs58";
import { BorshCoder } from "../coders/borsh";
import { BufferLayoutCoder } from "../coders/buffer-layout";
import { IBalance, ITransaction } from "./internal-types";
import { toSortedArray } from "./sortable";

/** Converts lamports to SOL */
export const toSol = (x: number): BigNumber =>
  new BigNumber(x).div(new BigNumber(LAMPORTS_PER_SOL));

export const toLamports = (x: number | string): BigNumber =>
  new BigNumber(x).multipliedBy(new BigNumber(LAMPORTS_PER_SOL));

const SHORT_TRUNC_TO = 7;
/** Shortens public keys to a truncated format */
export const short = (pubkey: string) =>
  `${pubkey.substring(0, SHORT_TRUNC_TO)}...${pubkey.substring(
    pubkey.length - SHORT_TRUNC_TO
  )}`;

export const isValidPublicKey = (key: string): boolean => {
  let valid = false;
  try {
    valid = bs58.decode(key).length === 32;
  } catch (_) {}

  return valid;
};

/**  Maps an internal transaction to the web3.js so it can be sent to the chain **/
export const mapITransactionToWeb3Transaction = (
  transactionData: ITransaction
): Transaction => {
  // TODO filter out empty fields
  const transaction = new Transaction();

  toSortedArray(transactionData.instructions).forEach(
    ({ programId, accounts, data, disabled }) => {
      if (disabled || !programId) return;

      // handle instruction data
      let buffer;
      if (data.format === "borsh" && data.borsh) {
        buffer = new BorshCoder().encode(toSortedArray(data.borsh));
      } else if (data.format === "bufferLayout" && data.bufferLayout) {
        buffer = new BufferLayoutCoder().encode(
          toSortedArray(data.bufferLayout)
        );
      } else if (data.format === "raw" && data.raw) {
        buffer = Buffer.from(data.raw);
      } else {
        // TODO
      }

      // add transcation
      transaction.add(
        new TransactionInstruction({
          programId: new PublicKey(programId),
          keys: toSortedArray(accounts).map(
            ({ pubkey, isWritable, isSigner }) => ({
              pubkey: new PublicKey(pubkey),
              isWritable,
              isSigner,
            })
          ),
          data: buffer,
        })
      );
    }
  );

  return transaction;
};

export const extractBalances = (
  transaction: TransactionResponse
): IBalance[] => {
  const { accountKeys } = transaction.transaction.message;
  const { preBalances, postBalances } = transaction.meta!;

  return accountKeys.map((address, index) => ({
    address: address.toBase58(),
    before: preBalances[index],
    after: postBalances[index],
  }));
};

export const mapWeb3TransactionError = (err: any): string => {
  if (!err) return "";

  let error = "Unexpected error";

  if (typeof err === "string" || err instanceof String) {
    error = err as string;
  } else {
    // this doesn't seem to match web3.js types but still comes back from RPC endpoint 🤷
    const errObject = err as Record<string, any>;
    if (errObject?.InstructionError) {
      const [index, errorCode] = errObject.InstructionError;
      error = `Error at Instruction ${index}: ${JSON.stringify(errorCode)}`;
    }
  }

  return error;
};
