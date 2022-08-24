import { Message, PublicKey, Signer, Transaction } from "@solana/web3.js";

import { Buffer } from "buffer";
import { forceUint8Array } from "./utils";
import * as nacl from "tweetnacl";

export const toBuffer = (arr: Buffer | Uint8Array | Array<number>): Buffer => {
  if (Buffer.isBuffer(arr)) {
    return arr;
  } else if (arr instanceof Uint8Array) {
    return Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength);
  } else {
    return Buffer.from(arr);
  }
};

type PartialSign = (
  this: Transaction,
  message: Message,
  ...signers: Array<Signer>
) => void;

type AddSignature = (
  this: Transaction,
  pubkey: PublicKey,
  signature: Buffer
) => void;

type VerifySignatures = (
  this: Transaction,
  signData: Buffer,
  requireAllSignatures: boolean
) => boolean;

export type TransactionWithInternals = Transaction & {
  _partialSign: PartialSign;
  _addSignature: AddSignature;
  _verifySignatures: VerifySignatures;
};

export function partialSign(
  this: TransactionWithInternals,
  message: Message,
  ...signers: Array<Signer>
) {
  const serializedMessage = message.serialize();
  const signData = forceUint8Array(serializedMessage);
  signers.forEach((signer) => {
    const secretKey = forceUint8Array(signer.secretKey);
    const signature = nacl.sign.detached(signData, secretKey);
    this._addSignature(signer.publicKey, toBuffer(signature));
  });
}

export function verifySignatures(
  this: TransactionWithInternals,
  signData: Buffer,
  requireAllSignatures: boolean
): boolean {
  for (const { signature, publicKey } of this.signatures) {
    if (signature === null) {
      if (requireAllSignatures) {
        return false;
      }
    } else {
      const publicKeyBuf = publicKey.toBuffer();
      if (
        !nacl.sign.detached.verify(
          forceUint8Array(signData),
          forceUint8Array(signature),
          forceUint8Array(publicKeyBuf)
        )
      ) {
        return false;
      }
    }
  }
  return true;
}
