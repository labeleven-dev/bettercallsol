// The internal common model
// Use as intermediate for other models and for tracking transaction state in the app

import {
  clusterApiUrl,
  Commitment,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  TransactionConfirmationStatus,
  TransactionInstruction,
  TransactionResponse,
} from "@solana/web3.js";
import { v4 as uuid } from "uuid";
import { UIInstructionState } from "./state";

/** Converts lamports to SOL */
export const toSol = (x: number) => x / LAMPORTS_PER_SOL;

const SHORT_TRUNC_TO = 7;
/** Shortens public keys to a truncated format */
export const short = (pubkey: string) =>
  `${pubkey.substring(0, SHORT_TRUNC_TO)}...${pubkey.substring(
    pubkey.length - SHORT_TRUNC_TO
  )}`;

export type IID = string;
export type IPubKey = string;

export interface IAccount {
  id: IID;
  name?: string;
  pubkey: IPubKey;
  isWritable: boolean;
  isSigner: boolean;
}

export const newAccount = (): IAccount => ({
  id: uuid(),
  pubkey: "",
  isSigner: false,
  isWritable: false,
});

export type IPlainText = string;

export interface IInstruction {
  id: IID;
  name?: string;
  programId: IPubKey;
  // The map and id array is to cater for Sortable component
  accountOrder: IID[];
  accounts: Record<IID, IAccount>;
  data: IPlainText; // TODO anchor
}

export const newInstruction = (): IInstruction => ({
  id: uuid(),
  name: "New Instruction",
  programId: "",
  data: "",
  accounts: {},
  accountOrder: [],
});

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
  // The map and id array is to cater for Sortable component
  instructionOrder: IID[];
  instructions: Record<IID, IInstruction>;
}

export interface IBalance {
  address: string;
  before: number;
  after: number;
}

export interface IResults {
  inProgress: boolean;
  signature: string; // not optional to work-around uncontrolled input issue
  startedAt?: number;
  slot?: number;
  confirmations?: number;
  confirmationStatus?: TransactionConfirmationStatus;
  finalisedAt?: number;
  blockTime?: number;
  fee?: number;
  balances?: IBalance[];
  error?: string;
  logs?: string[];
}

export interface ICommitment {
  id: Commitment;
  name: string;
}

export const COMMITMENT_LEVELS = [
  { id: "processed", name: "Processed" },
  { id: "confirmed", name: "Confirmed" },
  { id: "finalized", name: "Finalized" },
  { id: "recent", name: "Recent" },
  { id: "single", name: "Single" },
  { id: "singleGossip", name: "Single Gossip" },
  { id: "root", name: "Root" },
  { id: "max", name: "Max" },
];

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
  pollingPeriod: number; // used in our app, rather than passed to web3.js stuff
}

/**  Maps an internal transaction to the web3.js so it can be sent to the chain **/
export const mapToTransaction = (
  transactionData: ITransaction,
  uiInstructions: Record<IID, UIInstructionState>
): Transaction => {
  // TODO filter out empty fields
  const transaction = new Transaction();
  transactionData.instructionOrder.forEach((id) => {
    const { programId, accountOrder, accounts, data } =
      transactionData.instructions[id];
    if (uiInstructions[id].disabled || !programId) return;
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

export const mapToIResults = (transaction: TransactionResponse): IResults => {
  const { accountKeys } = transaction.transaction.message;
  const { logMessages, err, fee, preBalances, postBalances } =
    transaction.meta!;

  // determine balances
  let balances = accountKeys.map((address, index) => ({
    address: address.toBase58(),
    before: preBalances[index],
    after: postBalances[index],
  }));

  return {
    inProgress: false,
    signature: transaction.transaction.signatures[0],
    confirmationStatus: "finalized",
    finalisedAt: new Date().getTime(),
    blockTime: transaction.blockTime || undefined,
    slot: transaction?.slot,
    balances,
    logs: logMessages || [],
    error: err as string,
    fee,
  };
};
