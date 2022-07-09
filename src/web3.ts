// decouple web3.js stuff from UI models

import {
  clusterApiUrl,
  Commitment,
  PublicKey,
  Transaction,
  TransactionConfirmationStatus,
  TransactionInstruction,
} from "@solana/web3.js";

// TODO what is exported is a subset of the fields, i.e. don't export ui settings

export type IID = string;
export type IPubKey = string;

export interface IAccount {
  id: IID;
  name?: string;
  pubkey: IPubKey;
  isWritable: boolean;
  isSigner: boolean;
}

export type IPlainText = string;

export interface IInstruction {
  id: IID;
  name?: string;
  programId: IPubKey;
  accountOrder: IID[];
  accounts: { [key: IID]: IAccount };
  data: IPlainText; // TODO anchor

  // UI
  disabled: boolean;
  expanded: boolean;
}

export interface INetwork {
  id: "devnet" | "testnet" | "mainnet-beta";
  name: "Devnet" | "Testnet" | "Mainnet-beta" | "Custom";
  url: string;
}

export const DEFAULT_NETWORKS: INetwork[] = [
  { id: "devnet", name: "Devnet", url: clusterApiUrl("devnet") },
  { id: "testnet", name: "Testnet", url: clusterApiUrl("testnet") },
  {
    id: "mainnet-beta",
    name: "Mainnet-beta",
    url: clusterApiUrl("mainnet-beta"),
  },
];

export interface ITransaction {
  name?: string;
  instructionOrder: IID[];
  instructions: { [key: IID]: IInstruction };
}

export interface IResults {
  inProgress: boolean;
  signature: string; // not optional to work-around uncontrolled input issue
  startedAt?: number;
  slot?: number;
  confirmations?: number;
  confirmationStatus?: TransactionConfirmationStatus;
  fee?: number;
  error?: string;
  logs?: string[];
}

export interface ITransactionOptions {
  network: INetwork;
  customNetworks: INetwork[];
  skipPreflight: boolean;
  commitment: Commitment;
  maxRetries: number;
  preflightCommitment?: Commitment;
  disableRetryOnRateLimit: boolean;
  confirmTransactionInitialTimeout: number;
  confirmTransactionTimeout: number;
}

export const mapTransaction = (transactionData: ITransaction): Transaction => {
  // TODO filter out empty fields
  const transaction = new Transaction();
  transactionData.instructionOrder.forEach((id) => {
    const { disabled, programId, accountOrder, accounts, data } =
      transactionData.instructions[id];
    if (disabled) return;
    transaction.add(
      new TransactionInstruction({
        programId: new PublicKey(programId),
        keys: accountOrder.map((id) => {
          const { pubkey, isWritable, isSigner } = accounts[id];
          return {
            pubkey: new PublicKey(pubkey),
            isWritable,
            isSigner,
          };
        }),
        data: Buffer.from(data),
      })
    );
  });
  return transaction;
};
