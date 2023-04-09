import { SIGHASH_GLOBAL_NAMESPACE } from "@project-serum/anchor/dist/cjs/coder/borsh/instruction";
import {
  LAMPORTS_PER_SOL,
  TransactionVersion,
  VersionedTransaction,
} from "@solana/web3.js";
import BigNumber from "bignumber.js";
import bs58 from "bs58";
import { sha256 } from "js-sha256";
import { snakeCase } from "snake-case";

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

export const toTransactionVersion = (
  version: string | undefined
): TransactionVersion =>
  !version || version === "legacy"
    ? "legacy"
    : (Number(version) as TransactionVersion);

// https://github.com/coral-xyz/anchor/blob/ebe88187e3c7ba07df023f0ebfc19afb3d663bf6/ts/src/coder/borsh/instruction.ts#L386-L392
export const anchorMethodSighash = (anchorMethod: string): Buffer => {
  let name = snakeCase(anchorMethod);
  let preimage = `${SIGHASH_GLOBAL_NAMESPACE}:${name}`;
  return Buffer.from(sha256.digest(preimage)).slice(0, 8);
};

export const getAllAccounts = (transaction: VersionedTransaction) => {
  const staticAccounts = transaction.message.staticAccountKeys;
  const lookupAccounts =
    transaction.message.getAccountKeys().accountKeysFromLookups;
  const writableLookup = lookupAccounts?.writable || [];
  const readOnlyLookup = lookupAccounts?.readonly || [];
  return staticAccounts.concat(writableLookup).concat(readOnlyLookup);
};
