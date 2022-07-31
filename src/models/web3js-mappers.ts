import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SignatureStatus,
  Transaction,
  TransactionInstruction,
  TransactionResponse,
} from "@solana/web3.js";
import BigNumber from "bignumber.js";
import bs58 from "bs58";
import { BorshCoder } from "../coders/borsh";
import { BufferLayoutCoder } from "../coders/buffer-layout";
import { IResults, ITransaction } from "./internal-types";
import { toSortedArray } from "./sortable";

/** Converts lamports to SOL */
export const toSol = (x: number): BigNumber =>
  new BigNumber(x).div(new BigNumber(LAMPORTS_PER_SOL));

const SHORT_TRUNC_TO = 7;
/** Shortens public keys to a truncated format */
export const short = (pubkey: string) =>
  `${pubkey.substring(0, SHORT_TRUNC_TO)}...${pubkey.substring(
    pubkey.length - SHORT_TRUNC_TO
  )}`;

export const isValidPublicKey = (key: string): boolean =>
  bs58.decode(key).length === 32;

/**  Maps an internal transaction to the web3.js so it can be sent to the chain **/
export const mapToTransaction = (
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

export const mapFromSignatureStatus = ({
  slot,
  confirmationStatus,
  confirmations,
  err,
}: SignatureStatus): Partial<IResults> => ({
  slot,
  confirmationStatus,
  confirmations: confirmations || undefined,
  error: mapError(err),
});

export const mapFromTransactionResponse = (
  transaction: TransactionResponse
): IResults => {
  const { accountKeys } = transaction.transaction.message;
  const { logMessages, err, fee, preBalances, postBalances } =
    transaction.meta!;

  // determine balances
  let balances = accountKeys.map((address, index) => ({
    address: address.toBase58(),
    before: preBalances[index],
    after: postBalances[index],
  }));

  return {
    inProgress: false,
    signature: transaction.transaction.signatures[0],
    confirmationStatus: "finalized",
    finalisedAt: new Date().getTime(),
    blockTime: transaction.blockTime || undefined,
    slot: transaction?.slot,
    balances,
    logs: logMessages || [],
    error: mapError(err),
    fee,
  };
};

const mapError = (err: any): string => {
  if (!err) return "";

  let error = "Unexpected error";

  if (typeof err === "string" || err instanceof String) {
    error = err as string;
  } else {
    // this doesn't seem to match web3.js types but still comes back from RPC endpoint 🤷
    const errObject = err as Record<string, any>;
    if (errObject?.InstructionError) {
      error = `Instruction Error: ${errObject.InstructionError[1]} (${errObject.InstructionError[0]})`;
    }
  }

  return error;
};