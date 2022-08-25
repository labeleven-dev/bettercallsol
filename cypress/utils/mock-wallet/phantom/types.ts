import { EventEmitter } from "@solana/wallet-adapter-base";
import {
  Commitment,
  Finality,
  PublicKey,
  RpcResponseAndContext,
  SendOptions,
  SignatureResult,
  Transaction,
  TransactionError,
  TransactionResponse,
  TransactionSignature,
} from "@solana/web3.js";

declare global {
  namespace Cypress {
    interface ApplicationWindow {
      phantom?: {
        solana?: PhantomWallet;
      };
      solana?: PhantomWallet;
    }
  }
}

export interface PhantomWalletEvents {
  connect(...args: unknown[]): unknown;

  disconnect(...args: unknown[]): unknown;

  accountChanged(newPublicKey: PublicKey): unknown;
}

/**
 * This interface matches the Phantom Wallet interface as expected in the solana
 * wallet-adapter.
 * {@link https://github.com/solana-labs/wallet-adapter/blob/master/packages/wallets/phantom/src/adapter.ts}
 */
export interface PhantomWallet extends EventEmitter<PhantomWalletEvents> {
  isPhantom?: boolean;
  publicKey?: { toBytes(): Uint8Array; toBase58(): string };
  isConnected: boolean;

  signTransaction(transaction: Transaction): Promise<Transaction>;

  signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;

  signAndSendTransaction(
    transaction: Transaction,
    options?: SendOptions
  ): Promise<{ signature: TransactionSignature }>;

  signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }>;

  connect(): Promise<void>;

  disconnect(): Promise<void>;

  _handleDisconnect(...args: unknown[]): unknown;

  requestAirdrop(sol: number): Promise<RpcResponseAndContext<SignatureResult>>;

  connectionURL: string;

  getBalance(commitment: Commitment): Promise<number>;

  getBalanceSol(commitment: Commitment): Promise<number>;

  transactionSignatures: string[];

  getConfirmedTransaction(
    signature: string,
    commitment?: Finality
  ): Promise<null | TransactionResponse>;
}

export interface PhantomWindow extends Window {
  phantom?: {
    solana?: PhantomWallet;
  };
  solana?: PhantomWallet;
}

export type TransactionSummary = {
  logMessages: string[];
  fee: number | undefined;
  slot: number;
  blockTime: number;
  err: TransactionError | null | undefined;
};
