import { ConfirmOptions, Connection, Keypair } from "@solana/web3.js";
import fs from "fs";
import {
  deleteTransactionAccount,
  getAllTransactionsFromWallet,
  shareTransaction,
} from "./lib/bettercallsol";
import * as ion from "ion-js";

async function main() {
  let transactionDataJson =
    '{"name":"System Program: Transfer","instructions":[{"name":"Transfer","programId":"11111111111111111111111111111111","accounts":[{"type":{"type":"wallet"},"name":"From","pubkey":"9Cu4vedBwbXaFArdSRkWugedyGwPckxuoAEVmg37jbfV","isWritable":true,"isSigner":true},{"type":{"type":"unspecified"},"name":"To","pubkey":"GoctE4EU5jZqbWg1Ffo5sjCqjrnzW1m76JmWwd84pwtV","isWritable":true,"isSigner":false}],"data":{"format":"bufferLayout","value":[{"name":"Instruction","type":"u32","value":2},{"name":"Lamport","type":"u64","value":100000}]}}]}';
  // let transactionData = JSON.parse(transactionDataJson);

  const TXN_OPTS: ConfirmOptions = {
    commitment: "confirmed",
    preflightCommitment: "confirmed",
    skipPreflight: true,
  };
  const connection = new Connection("http://127.0.0.1:8899", TXN_OPTS);
  const payer = Keypair.fromSecretKey(
    Uint8Array.from(
      JSON.parse(fs.readFileSync("./.key/localhost.json", "utf8"))
    )
  );

  let transactionAccount = await shareTransaction(
    connection,
    payer,
    transactionDataJson,
    "confirmed",
    TXN_OPTS
  );

  console.log(transactionAccount);

  let allTransactionAccounts = await getAllTransactionsFromWallet(
    connection,
    payer.publicKey
  );

  console.log(allTransactionAccounts);

  for (let account of allTransactionAccounts) {
    let txDelete = await deleteTransactionAccount(
      connection,
      payer,
      account.md5
    );

    console.log(txDelete);
  }

  allTransactionAccounts = await getAllTransactionsFromWallet(
    connection,
    payer.publicKey
  );

  console.log(allTransactionAccounts);
}

main();
