import {
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  TransactionInstruction,
  TransactionResponse,
} from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { BorshCoder } from "../coders/borsh";
import { BufferLayoutCoder } from "../coders/buffer-layout";
import { IResults, ITransaction } from "./internal-types";
import { IID, toSortedArray } from "./sortable";
import { UIInstructionState } from "./state-types";

/** Converts lamports to SOL */
export const toSol = (x: number): BigNumber =>
  new BigNumber(x).div(new BigNumber(LAMPORTS_PER_SOL));

const SHORT_TRUNC_TO = 7;
/** Shortens public keys to a truncated format */
export const short = (pubkey: string) =>
  `${pubkey.substring(0, SHORT_TRUNC_TO)}...${pubkey.substring(
    pubkey.length - SHORT_TRUNC_TO
  )}`;

/**  Maps an internal transaction to the web3.js so it can be sent to the chain **/
export const mapToTransaction = (
  transactionData: ITransaction,
  uiInstructions: Record<IID, UIInstructionState>
): Transaction => {
  // TODO filter out empty fields
  const transaction = new Transaction();

  toSortedArray(transactionData.instructions).forEach(
    ({ id, programId, accounts, data }) => {
      if (uiInstructions[id].disabled || !programId) return;

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

export const mapToIResults = (transaction: TransactionResponse): IResults => {
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
    error: err as string,
    fee,
  };
};
