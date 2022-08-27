import { Buffer } from "buffer";
import { BCSTransaction } from "./types";
import { PublicKey } from "@solana/web3.js";
import * as brotli from "brotli";

export function decodeBCSTransaction(
  address: PublicKey,
  buffer: Buffer
): BCSTransaction {
  let version = buffer.slice(8, 8 + 1).readUInt8();
  let bump = buffer.slice(9, 9 + 1).readUInt8();
  let authority = new PublicKey(buffer.slice(10, 42));
  let md5 = buffer.slice(42, 42 + 16).toString("hex");
  let size = buffer.slice(58, 60).readUint16BE();
  let dataBuffer = buffer.slice(60, 60 + size);
  let data;
  try {
    let decompressed = brotli.decompress(dataBuffer, size);
    data = Buffer.from(decompressed).toString("utf-8");
  } catch (e) {
    // brotli decompress error when there is no data
    data = dataBuffer.toString("utf-8");
  }

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
