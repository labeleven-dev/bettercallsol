import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { BorshCoder } from "../coders/borsh";
import { BufferLayoutCoder } from "../coders/buffer-layout";
import { ITransaction } from "../types/internal";
import { toSortedArray } from "../utils/sortable";
import { anchorMethodSighash, isValidPublicKey } from "../utils/web3js";
import bs58 from "bs58";

export const mapITransactionToWeb3Transaction = ({
  instructions,
}: ITransaction): Transaction => {
  const transaction = new Transaction();

  toSortedArray(instructions).forEach(
    (
      { programId, accounts, data, disabled, anchorMethod, anchorAccounts },
      index
    ) => {
      if (disabled) return;

      // handle instruction data
      let buffer = Buffer.from(""); // empty
      try {
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
        } else if (data.format === "raw" && data.raw.content) {
          if (data.raw.encoding === "hex") {
            buffer = Buffer.from(data.raw.content, "hex");
          } else {
            buffer = Buffer.from(bs58.decode(data.raw.content));
          }
        }
      } catch (err) {
        const message = Object.getOwnPropertyNames(err).includes("message")
          ? (err as { message: string }).message
          : JSON.stringify(err);
        throw new Error(
          `Error at Instruction #${index + 1}: ${message} in Data`
        );
      }

      // accounts
      const keys = (anchorAccounts || [])
        .concat(toSortedArray(accounts))
        .map(({ pubkey, isWritable, isSigner }, keyIdx) => ({
          pubkey: (() => {
            if (isValidPublicKey(pubkey)) {
              return new PublicKey(pubkey);
            } else {
              throw new Error(
                `Error at Instruction #${
                  index + 1
                }: Invalid public key input ${pubkey} in Accounts #${
                  keyIdx + 1
                }`
              );
            }
          })(),
          isWritable,
          isSigner,
        }));

      // add transaction
      transaction.add(
        new TransactionInstruction({
          programId: (() => {
            if (isValidPublicKey(programId)) {
              return new PublicKey(programId);
            } else {
              throw new Error(
                `Error at Instruction #${
                  index + 1
                }: Invalid program id ${programId}`
              );
            }
          })(),
          keys,
          data: buffer,
        })
      );
    }
  );

  return transaction;
};
