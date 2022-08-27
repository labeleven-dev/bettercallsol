import { PublicKey } from "@solana/web3.js";

export const PROGRAM_ID = new PublicKey(
  "HCcwD495j265Vqunp55pS8z64ddt9FnoswnBi61FH22S"
);

export const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);
export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);
export const RENT_PROGRAM_ID = new PublicKey(
  "SysvarRent111111111111111111111111111111111"
);
export const SYSTEM_PROGRAM_ID = new PublicKey(
  "11111111111111111111111111111111"
);

export const TRANSACTION_DATA_LOC =
  8 + // discriminator
  1 + // version
  1 + // bump
  32 + // authority
  16 + // md5
  2; // size

export const TRANSACTION_AUTHORITY_LOC =
  8 + // discriminator
  1 + // version
  1; // bump

export const TRANSACTION_SIZE_LOC =
  8 + // discriminator
  1 + // version
  1 + // bump
  32 + // authority
  16; // md5
