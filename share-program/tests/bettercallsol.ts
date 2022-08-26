import * as anchor from "@project-serum/anchor";
import { Program, BN } from "@project-serum/anchor";
import { ConfirmOptions, PublicKey, Transaction } from "@solana/web3.js";
import { Bettercallsol } from "../target/types/bettercallsol";
import { assert, expect } from "chai";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccount,
  createMint,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import * as crypto from "crypto";

const connection = anchor.getProvider().connection;

const PREFIX = "bcs";
const USER_SEED = "user";
const COLLECTION_SEED = "collection";
const TRANSACTION_SEED = "transaction";

const LAMPORTS_PER_SOL = 1_000_000_000;
const TXN_OPTS: ConfirmOptions = {
  commitment: "processed",
  preflightCommitment: "processed",
  skipPreflight: true,
};

describe("better call sol", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.local(null, TXN_OPTS));

  const program = anchor.workspace.Bettercallsol as Program<Bettercallsol>;

  let authority = anchor.web3.Keypair.generate();
  let user;
  let userBump;
  let collection;
  let collectionBump;
  let collectionMint;
  let collectionMintVault;

  it("initialize environment", async () => {
    let airdropAmount = 10_000_000_000;
    await anchor
      .getProvider()
      .connection.confirmTransaction(
        await anchor
          .getProvider()
          .connection.requestAirdrop(authority.publicKey, airdropAmount),
        "confirmed"
      );

    let authorityBalance = await anchor
      .getProvider()
      .connection.getBalance(authority.publicKey);

    // console.log('user rent ', await anchor.getProvider().connection.getMinimumBalanceForRentExemption(program.account.user.size) / LAMPORTS_PER_SOL)
    // console.log('collection rent ', await anchor.getProvider().connection.getMinimumBalanceForRentExemption(program.account.collection.size)/ LAMPORTS_PER_SOL)
    // console.log('transaction rent ', await anchor.getProvider().connection.getMinimumBalanceForRentExemption(program.account.transaction.size)/ LAMPORTS_PER_SOL)

    assert(authorityBalance === airdropAmount);
  });

  it("initialize user account", async () => {
    [user, userBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from(PREFIX, "utf-8"),
        Buffer.from(USER_SEED, "utf-8"),
        authority.publicKey.toBuffer(),
      ],
      program.programId
    );

    console.log("user pda: ", user.toBase58());

    const tx = await program.methods
      .initializeUser()
      .accounts({
        authority: authority.publicKey,
        user: user,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([authority])
      .rpc();

    let userAccount = await program.account.user.fetch(user);
    // console.log(userAccount)

    expect(userAccount.authority.toBase58()).to.equal(
      authority.publicKey.toBase58()
    );
    expect(userAccount.numberOfCollections).to.equal(0);
  });

  it("initialize collection", async () => {
    collectionMint = new anchor.web3.Keypair();
    collectionMintVault = await getAssociatedTokenAddress(
      collectionMint.publicKey,
      authority.publicKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    [collection, collectionBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from(PREFIX, "utf-8"),
        Buffer.from(COLLECTION_SEED, "utf-8"),
        authority.publicKey.toBuffer(),
        collectionMint.publicKey.toBuffer(),
      ],
      program.programId
    );

    console.log("user: ", user.toBase58());
    console.log("collection mint: ", collectionMint.publicKey.toBase58());
    console.log("collection mint vault: ", collectionMintVault.toBase58());
    console.log("collection pda: ", collection.toBase58());

    const tx = await program.methods
      .initializeCollection()
      .accounts({
        payer: authority.publicKey,
        user: user,
        collection: collection,
        collectionMint: collectionMint.publicKey,
        collectionMintVault: collectionMintVault,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([authority, collectionMint])
      .rpc();

    let userAccount = await program.account.user.fetch(user);

    expect(userAccount.authority.toBase58()).to.equal(
      authority.publicKey.toBase58()
    );
    expect(userAccount.numberOfCollections).to.equal(1);

    let collectionAccount = await program.account.collection.fetch(collection);

    expect(collectionAccount.authority.toBase58()).to.equal(
      authority.publicKey.toBase58()
    );
    expect(collectionAccount.collectionMint.toBase58()).to.equal(
      collectionMint.publicKey.toBase58()
    );

    let collectionMintAccount = await connection.getParsedAccountInfo(
      collectionMint.publicKey
    );
    expect(
      Number(collectionMintAccount["value"]["data"]["parsed"]["info"]["supply"])
    ).to.equal(1);
    expect(
      collectionMintAccount["value"]["data"]["parsed"]["info"]["mintAuthority"]
    ).to.equal(null);
  });

  let transaction;
  let transactionBump;
  let transactionData =
    '{"name":"System Program: Transfer","instructions":[{"name":"Transfer","programId":"11111111111111111111111111111111","accounts":[{"type":{"type":"wallet"},"name":"From","pubkey":"9Cu4vedBwbXaFArdSRkWugedyGwPckxuoAEVmg37jbfV","isWritable":true,"isSigner":true},{"type":{"type":"unspecified"},"name":"To","pubkey":"GoctE4EU5jZqbWg1Ffo5sjCqjrnzW1m76JmWwd84pwtV","isWritable":true,"isSigner":false}],"data":{"format":"bufferLayout","value":[{"name":"Instruction","type":"u32","value":2},{"name":"Lamport","type":"u64","value":100000}]}}]}';
  // let transactionData = "abcdefg"
  let transactionBytes = Buffer.from(transactionData);

  it("initialize transaction", async () => {
    let hash = crypto.createHash("md5").update(transactionData).digest("hex");

    let md5 = Uint8Array.from(Buffer.from(hash, "hex"));

    console.log("md5: ", md5);
    let size = transactionBytes.length;

    [transaction, transactionBump] =
      anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from(PREFIX, "utf-8"),
          Buffer.from(TRANSACTION_SEED, "utf-8"),
          authority.publicKey.toBuffer(),
          collection.toBuffer(),
          md5,
        ],
        program.programId
      );
    console.log("transaction pda: ", transaction.toBase58());

    const tx = await program.methods
      .initializeTransaction(
        // @ts-ignore
        md5,
        size
      )
      .accounts({
        payer: authority.publicKey,
        collection: collection,
        accessKey: collectionMint.publicKey,
        accessKeyVault: collectionMintVault,
        transaction: transaction,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([authority])
      .rpc();

    let transactionAccount = await program.account.transaction.fetch(
      transaction
    );
    console.log(transactionAccount);

    expect(transactionAccount.authority.toBase58()).to.equal(
      authority.publicKey.toBase58()
    );
    expect(transactionAccount.collectionMint.toBase58()).to.equal(
      collectionMint.publicKey.toBase58()
    );
    expect(transactionAccount.size).to.equal(transactionBytes.length);
  });

  it("update transaction", async () => {
    let chunkSize = 1000;

    if (transactionBytes.length < chunkSize) {
      const tx = await program.methods
        .updateTransaction(0, transactionBytes.length, transactionBytes)
        .accounts({
          payer: authority.publicKey,
          collection: collection,
          accessKey: collectionMint.publicKey,
          accessKeyVault: collectionMintVault,
          transaction: transaction,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .signers([authority])
        .rpc();
    } else {
      let offset = 0;
      do {
        let transactionBytesBatch = transactionBytes.subarray(
          offset,
          offset + chunkSize
        );
        let tx = await program.methods
          .updateTransaction(
            offset,
            Math.min(chunkSize, transactionBytes.length - offset),
            transactionBytesBatch
          )
          .accounts({
            payer: authority.publicKey,
            collection: collection,
            accessKey: collectionMint.publicKey,
            accessKeyVault: collectionMintVault,
            transaction: transaction,
            systemProgram: anchor.web3.SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          })
          .signers([authority])
          .rpc();
        offset = offset + chunkSize;
      } while (offset < transactionBytes.length);
    }

    let transactionAccount = await program.account.transaction.fetch(
      transaction
    );
    console.log(transactionAccount);

    expect(transactionAccount.authority.toBase58()).to.equal(
      authority.publicKey.toBase58()
    );
    expect(transactionAccount.collectionMint.toBase58()).to.equal(
      collectionMint.publicKey.toBase58()
    );

    let transactionAccountRaw = await connection.getAccountInfo(transaction);
    let transactionAccountRawData = transactionAccountRaw.data;
    console.log(transactionAccountRawData);

    let TRANSACTION_DATA_LOC =
      8 + // discriminator
      1 + // version
      1 + // bump
      32 + // authority
      32 + // collection mint
      16 + // md5
      2; // size

    let transactionDataBuffer =
      transactionAccountRawData.slice(TRANSACTION_DATA_LOC);
    console.log(transactionDataBuffer);
    console.log(transactionBytes);

    let dataDecoded = transactionDataBuffer.toString("utf-8");
    console.log(dataDecoded);
    // expect(dataDecoded).to.equal(transactionData);
  });
});
