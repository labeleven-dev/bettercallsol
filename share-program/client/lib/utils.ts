import { sha256 } from "js-sha256";
import { snakeCase } from "snake-case";
import fs from "fs";
import crypto from "crypto";

export function getInstructionDiscriminator(ixName: string): Buffer {
  let name = snakeCase(ixName);
  let preimage = `global:${name}`;
  return Buffer.from(sha256.digest(preimage)).slice(0, 8);
}

export function readSecret(secretName) {
  try {
    // secrets is either provided through .env (node) or secrets (docker)
    const path = process.env.WALLET || `/run/secrets/${secretName}`;
    return fs.readFileSync(path, "utf8");
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error(
        `An error occurred while trying to read the secret path. Err: ${err}`
      );
    } else {
      console.debug(`Could not find the secret,: ${secretName}. Err: ${err}`);
    }
    return "";
  }
}

export function createHash(data: string): string {
  return crypto.createHash("md5").update(data).digest("hex");
}

export function hashToUint8Array(hash: string): Uint8Array {
  return Uint8Array.from(Buffer.from(hash, "hex"));
}
