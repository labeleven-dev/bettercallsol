import { Buffer } from "buffer";
import { BCSTransaction } from "./types";
import { PublicKey } from "@solana/web3.js";

export function decodeBCSTransaction(
  address: PublicKey,
  buffer: Buffer
): BCSTransaction {
  let version = buffer.slice(8, 8 + 1).readUInt8();
  let bump = buffer.slice(9, 9 + 1).readUInt8();
  let authority = new PublicKey(buffer.slice(10, 42));
  let md5 = buffer.slice(42, 42 + 16).toString("hex");
  let size = buffer.slice(58, 60).readUint16BE();
  let data = buffer.slice(60, 60 + size).toString("utf-8");

  return {
    address: address,
    version: version,
    bump: bump,
    authority: authority,
    md5: md5,
    size: size,
    data: data,
  };
}
