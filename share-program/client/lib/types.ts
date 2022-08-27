import { PublicKey } from "@solana/web3.js";

export interface BCSTransaction {
  address: PublicKey;
  version: number;
  bump: number;
  authority: PublicKey;
  md5: string;
  size: number;
  data: string;
}
