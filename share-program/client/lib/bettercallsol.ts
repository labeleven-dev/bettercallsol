import {
  AccountInfo,
  Commitment,
  ConfirmOptions,
  Connection,
  KeyedAccountInfo,
  PublicKey,
  sendAndConfirmTransaction,
  Signer,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import BufferLayout from "buffer-layout";
import {
  createHash,
  getInstructionDiscriminator,
  hashToUint8Array,
} from "./utils";
import { getTransactionAccountAddress } from "./addresses";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  CHUNK_SIZE,
  PROGRAM_ID,
  RENT_PROGRAM_ID,
  SYSTEM_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  TRANSACTION_AUTHORITY_LOC,
  TRANSACTION_BASIC_LENGTH,
} from "./constants";
import { Buffer } from "buffer";
import { BCSTransaction } from "./types";
import { decodeBCSTransaction } from "./coder";
import * as brotli from "brotli";

export function initializeTransactionInstruction(
  hash: string,
  size: number,
  authority: Signer
): TransactionInstruction {
  let md5 = hashToUint8Array(hash);

  let sizeLayout = BufferLayout.struct([BufferLayout.u16be("size")]);

  let data = Buffer.alloc(sizeLayout.span);
  sizeLayout.encode(
    {
      size: size,
    },
    data
  );
  let disc = getInstructionDiscriminator("initializeTransaction");
  data = Buffer.concat([disc, md5, data]);

  let keys = [
    { pubkey: authority.publicKey, isWritable: true, isSigner: true },
    {
      pubkey: getTransactionAccountAddress(authority.publicKey, hash),
      isWritable: true,
      isSigner: false,
    },
    { pubkey: SYSTEM_PROGRAM_ID, isWritable: false, isSigner: false },
    { pubkey: RENT_PROGRAM_ID, isWritable: false, isSigner: false },
  ];

  return new TransactionInstruction({
    keys,
    programId: PROGRAM_ID,
    data,
  });
}

export function updateTransactionInstruction(
  hash: string,
  authority: Signer,
  offset: number,
  size: number,
  transactionData: Buffer
): TransactionInstruction {
  let dataLayout = BufferLayout.struct([
    BufferLayout.u16("offset"),
    BufferLayout.u32("vec"), // size of vector
  ]);

  let data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      offset: offset,
      size: size,
      vec: size,
    },
    data
  );
  let disc = getInstructionDiscriminator("updateTransaction");
  data = Buffer.concat([disc, data, new Uint8Array(transactionData)]);

  let keys = [
    { pubkey: authority.publicKey, isWritable: true, isSigner: true },
    {
      pubkey: getTransactionAccountAddress(authority.publicKey, hash),
      isWritable: true,
      isSigner: false,
    },
    { pubkey: SYSTEM_PROGRAM_ID, isWritable: false, isSigner: false },
  ];

  return new TransactionInstruction({
    keys,
    programId: PROGRAM_ID,
    data,
  });
}

export function deleteTransactionInstruction(
  hash: string,
  authority: Signer
): TransactionInstruction {
  let data = getInstructionDiscriminator("deleteTransaction");

  let keys = [
    { pubkey: authority.publicKey, isWritable: true, isSigner: true },
    {
      pubkey: getTransactionAccountAddress(authority.publicKey, hash),
      isWritable: true,
      isSigner: false,
    },
    { pubkey: SYSTEM_PROGRAM_ID, isWritable: false, isSigner: false },
  ];

  return new TransactionInstruction({
    keys,
    programId: PROGRAM_ID,
    data,
  });
}

export async function getOrCreateTransactionAccount(
  connection: Connection,
  payer: Signer,
  hash: string,
  size: number,
  commitment?: Commitment,
  confirmOptions?: ConfirmOptions
): Promise<KeyedAccountInfo | null> {
  const transaction = await getTransactionAccountAddress(payer.publicKey, hash);

  let account: AccountInfo<Buffer> | null;
  try {
    account = await connection.getAccountInfo(transaction, commitment);
    if (account === null) {
      const tx = new Transaction().add(
        await initializeTransactionInstruction(hash, size, payer)
      );

      await sendAndConfirmTransaction(connection, tx, [payer], confirmOptions);

      // Now this should not be null
      account = await connection.getAccountInfo(transaction, commitment);
    }
  } catch (error: unknown) {
    throw error;
  }

  return {
    accountId: transaction,
    accountInfo: account,
  };
}

export async function shareTransaction(
  connection: Connection,
  payer: Signer,
  transactionJson: string,
  commitment?: Commitment,
  confirmOptions?: ConfirmOptions
): Promise<BCSTransaction> {
  let transactionBytes = brotli.compress(Buffer.from(transactionJson));
  let hash = createHash(transactionJson);

  // get or create transaction account
  let transactionAccountRaw = await getOrCreateTransactionAccount(
    connection,
    payer,
    hash,
    transactionBytes.length,
    commitment,
    confirmOptions
  );

  // decode transaction account
  let transactionAccount = decodeBCSTransaction(
    transactionAccountRaw.accountId,
    transactionAccountRaw.accountInfo.data
  );

  if (transactionAccount.md5 !== createHash(transactionAccount.data)) {
    // update transaction

    if (transactionBytes.length < CHUNK_SIZE) {
      let ix = await updateTransactionInstruction(
        hash,
        payer,
        0,
        transactionBytes.length,
        transactionBytes
      );

      let tx = await sendAndConfirmTransaction(
        connection,
        new Transaction().add(ix),
        [payer],
        confirmOptions
      );
    } else {
      let offset = 0;
      do {
        let transactionBytesBatch = transactionBytes.subarray(
          offset,
          offset + CHUNK_SIZE
        );
        let ix = await updateTransactionInstruction(
          hash,
          payer,
          offset,
          Math.min(CHUNK_SIZE, transactionBytes.length - offset),
          transactionBytesBatch
        );

        let tx = await sendAndConfirmTransaction(
          connection,
          new Transaction().add(ix),
          [payer],
          confirmOptions
        );
        offset = offset + CHUNK_SIZE;
      } while (offset < transactionBytes.length);
    }
    // get transaction account
    transactionAccountRaw = await getOrCreateTransactionAccount(
      connection,
      payer,
      hash,
      transactionBytes.length,
      commitment,
      confirmOptions
    );

    // decode transaction account
    transactionAccount = decodeBCSTransaction(
      transactionAccountRaw.accountId,
      transactionAccountRaw.accountInfo.data
    );
    if (transactionAccount.md5 !== createHash(transactionAccount.data)) {
      throw Error("Account Data does not match signature");
    }
  }

  return transactionAccount;
}

export async function getAllTransactionsFromWallet(
  connection: Connection,
  authority: PublicKey
): Promise<BCSTransaction[]> {
  let transactionAccounts = await connection.getProgramAccounts(PROGRAM_ID, {
    commitment: "confirmed",
    filters: [
      {
        memcmp: {
          offset: TRANSACTION_AUTHORITY_LOC,
          bytes: authority.toBase58(),
        },
      },
    ],
  });

  return transactionAccounts.map((account) =>
    decodeBCSTransaction(account.pubkey, account.account.data)
  );
}

export async function deleteTransactionAccount(
  connection: Connection,
  payer: Signer,
  hash: string,
  confirmOptions?: ConfirmOptions
): Promise<string> {
  let ix = await deleteTransactionInstruction(hash, payer);

  return await sendAndConfirmTransaction(
    connection,
    new Transaction().add(ix),
    [payer],
    confirmOptions
  );
}

export async function getEstimatedTransactionAccountCost(
  connection: Connection,
  transactionJson: string,
  commitment: Commitment
): Promise<number> {
  let transactionBytes = brotli.compress(Buffer.from(transactionJson));

  let dataLength = TRANSACTION_BASIC_LENGTH + transactionBytes.length;

  return await connection.getMinimumBalanceForRentExemption(
    dataLength,
    commitment
  );
}
