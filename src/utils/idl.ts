import { Address, Idl, translateAddress } from "@project-serum/anchor";
import {
  decodeIdlAccount,
  idlAddress,
} from "@project-serum/anchor/dist/cjs/idl";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { Connection } from "@solana/web3.js";
import { inflate } from "pako";

// Copied and modified from https://github.com/coral-xyz/anchor/blob/bf11f811d7142fc4db020a3597fccee70372c797/ts/src/program/index.ts#L339
// to remove the need for Provider (which needs Wallet but our interactions don't)

/**
 * Fetches an idl from the blockchain.
 *
 * In order to use this method, an IDL must have been previously initialized
 * via the anchor CLI's `anchor idl init` command.
 *
 * @param address The on-chain address of the program.
 * @param connection  The network.
 */
export const fetchIdl = async <IDL extends Idl = Idl>(
  address: Address,
  connection: Connection
): Promise<IDL | null> => {
  const programId = translateAddress(address);

  const idlAddr = await idlAddress(programId);
  const accountInfo = await connection.getAccountInfo(idlAddr);
  if (!accountInfo) {
    return null;
  }
  // Chop off account discriminator.
  let idlAccount = decodeIdlAccount(accountInfo.data.slice(8));
  const inflatedIdl = inflate(idlAccount.data);
  return JSON.parse(utf8.decode(inflatedIdl));
};
