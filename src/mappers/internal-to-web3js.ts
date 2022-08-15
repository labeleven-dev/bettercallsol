import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { BorshCoder } from "../coders/borsh";
import { BufferLayoutCoder } from "../coders/buffer-layout";
import { ITransaction } from "../types/internal";
import { toSortedArray } from "../utils/sortable";
import { anchorMethodSighash } from "../utils/web3js";

export const mapITransactionToWeb3Transaction = ({
  instructions,
}: ITransaction): Transaction => {
  const transaction = new Transaction();

  toSortedArray(instructions).forEach(
    ({ programId, accounts, data, disabled, anchorMethod, anchorAccounts }) => {
      if (disabled) return;

      // handle instruction data
      let buffer = Buffer.from(""); // empty
      if (data.format === "borsh" && data.borsh) {
        buffer = new BorshCoder().encode(toSortedArray(data.borsh));
        if (anchorMethod) {
          // prepend method sighash to instruction data
          buffer = Buffer.concat([anchorMethodSighash(anchorMethod), buffer]);
        }
      } else if (data.format === "bufferLayout" && data.bufferLayout) {
        buffer = new BufferLayoutCoder().encode(
          toSortedArray(data.bufferLayout)
        );
      } else if (data.format === "raw" && data.raw) {
        buffer = Buffer.from(data.raw);
      }

      // accounts
      const keys = (anchorAccounts || [])
        .concat(toSortedArray(accounts))
        .map(({ pubkey, isWritable, isSigner }) => ({
          pubkey: new PublicKey(pubkey),
          isWritable,
          isSigner,
        }));

      // add transcation
      transaction.add(
        new TransactionInstruction({
          programId: new PublicKey(programId),
          keys,
          data: buffer,
        })
      );
    }
  );

  return transaction;
};
