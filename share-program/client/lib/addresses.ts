import { PublicKey } from "@solana/web3.js";
import { PROGRAM_ID } from "./constants";
import { hashToUint8Array } from "./utils";

export const PREFIX = "bcs";
export const TRANSACTION_SEED = "transaction";

export function getTransactionAccountAddress(
  authority: PublicKey,
  hash: string
) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(PREFIX, "utf-8"),
      Buffer.from(TRANSACTION_SEED, "utf-8"),
      authority.toBuffer(),
      hashToUint8Array(hash),
    ],
    PROGRAM_ID
  )[0];
}
