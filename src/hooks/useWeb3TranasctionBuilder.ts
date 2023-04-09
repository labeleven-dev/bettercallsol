import { useToast } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  AddressLookupTableAccount,
  Connection,
  PublicKey,
  RpcResponseAndContext,
  SimulatedTransactionResponse,
  TransactionInstruction,
  TransactionMessage,
  TransactionVersion,
  VersionedTransaction,
} from "@solana/web3.js";
import { useConfigStore } from "hooks/useConfigStore";
import { useWeb3Connection } from "hooks/useWeb3Connection";
import { ITransaction } from "types/internal";
import { sentryCaptureException } from "utils/sentry";
import { getAllAccounts, isValidPublicKey } from "utils/web3js";

export type Web3TransactionWithContext = {
  transaction: VersionedTransaction;
  recentBlockhash: string;
  lastValidBlockHeight: number;
};

export type TransactionBuilderArgs = {
  /** Override Solana connection */
  connection?: Connection;
  /** Triggered when successfully simulated a transaction */
  onSimulated?: (
    response: RpcResponseAndContext<SimulatedTransactionResponse>,
    transactionWithContext: Web3TransactionWithContext
  ) => void;
  /** Triggered when successfully submitted a transaction */
  onSent?: (
    signature: string,
    transactionWithContext: Web3TransactionWithContext
  ) => void;
  /** Triggered when an error prematurely stops the process */
  onError?: (error: Error) => void;
};

/**
 * Building blocks for submitting and simulating Solana transaction
 */
export const useWeb3TransactionBuilder = ({
  connection,
  onSimulated,
  onSent,
  onError,
}: TransactionBuilderArgs): {
  /** Retrieve the accounts defined in LUTs (reads from chain)  */
  getAddressLookupTableAccounts: (
    transaction: ITransaction
  ) => Promise<AddressLookupTableAccount[]>;
  /** Builds a web3.js Transaction, along with latest blockhash info (reads from chain) */
  buildTransactionFromWeb3Instructions: (
    instructions: TransactionInstruction[],
    addressLookupTableAccounts?: AddressLookupTableAccount[],
    version?: TransactionVersion
  ) => Promise<Web3TransactionWithContext | undefined>;
  /** Wraps a function that may throw errors and adapts it to onError stuff */
  withErrorHandler: <T>(
    func: (arg: T) => Promise<void>
  ) => (arg: T) => Promise<void>;
  /** Simulates a web3.js Transaction */
  simulate: (transaction: Web3TransactionWithContext) => void;
  /** Submits a web3.js Transaction to the change */
  send: (transaction: Web3TransactionWithContext) => void;
} => {
  const transactionOptions = useConfigStore(
    (state) => state.transactionOptions
  );

  const toast = useToast();

  const defaultConnection = useWeb3Connection();
  const activeConnection = connection || defaultConnection;
  const {
    publicKey: payerKey,
    sendTransaction: walletSendTransaction,
    signTransaction,
  } = useWallet();

  const getAddressLookupTableAccounts = async (
    transaction: ITransaction
  ): Promise<AddressLookupTableAccount[]> => {
    if (transaction.version === "legacy") {
      return [];
    }

    return Promise.all(
      transaction.addressLookupTables.map(async (address, index) => {
        if (isValidPublicKey(address)) {
          const lookup = await activeConnection.getAddressLookupTable(
            new PublicKey(address)
          );
          if (!lookup.value) {
            throw new Error(
              `Cannot retrieve address lookup table (#${index + 1}): ${address}`
            );
          }
          return lookup.value;
        } else {
          throw new Error(
            `Invalid address lookup table (#${index + 1}): ${address}`
          );
        }
      })
    );
  };

  const buildTransactionFromWeb3Instructions = async (
    instructions: TransactionInstruction[],
    addressLookupTableAccounts?: AddressLookupTableAccount[],
    version: TransactionVersion = 0
  ): Promise<Web3TransactionWithContext | undefined> => {
    if (!payerKey) {
      throw new Error("Wallet not connected");
    }

    const { blockhash, lastValidBlockHeight } =
      await activeConnection.getLatestBlockhash();

    const message = new TransactionMessage({
      instructions,
      payerKey,
      recentBlockhash: blockhash,
    });

    return {
      transaction: new VersionedTransaction(
        addressLookupTableAccounts || version === 0
          ? message.compileToV0Message(addressLookupTableAccounts)
          : message.compileToLegacyMessage()
      ),
      recentBlockhash: blockhash,
      lastValidBlockHeight,
    };
  };

  const withErrorHandler = <T>(
    func: (arg: T) => Promise<void>
  ): ((arg: T) => Promise<void>) => {
    return async (arg: T) => {
      try {
        await func(arg);
      } catch (err) {
        sentryCaptureException(err);
        const message = Object.getOwnPropertyNames(err).includes("message")
          ? (err as { message: string }).message
          : JSON.stringify(err);
        onError && onError(new Error(message));
      }
    };
  };

  // simulate transaction
  const simulate = async (
    transactionWithContext: Web3TransactionWithContext
  ) => {
    let { transaction: web3Transaction } = transactionWithContext;

    if (transactionOptions.signVerifySimulation && !signTransaction) {
      toast({
        title: "Signature verifications skipped.",
        description:
          "Your wallet does not support signing simulated tranasction",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }

    web3Transaction =
      transactionOptions.signVerifySimulation && signTransaction
        ? await signTransaction(web3Transaction)
        : web3Transaction;

    const response = await activeConnection.simulateTransaction(
      web3Transaction,
      {
        accounts: {
          encoding: "base64",
          addresses: getAllAccounts(web3Transaction).map((account) =>
            account.toBase58()
          ),
        },
        sigVerify:
          transactionOptions.signVerifySimulation &&
          signTransaction !== undefined,
      }
    );

    onSimulated &&
      onSimulated(response, {
        ...transactionWithContext,
        transaction: web3Transaction,
      });
  };

  // send the transaction to the chain
  const send = async (transactionWithContext: Web3TransactionWithContext) => {
    const { transaction: web3Transaction } = transactionWithContext;

    const signature = await walletSendTransaction(
      web3Transaction,
      activeConnection,
      {
        skipPreflight: transactionOptions.skipPreflight,
        maxRetries: transactionOptions.maxRetries,
        preflightCommitment: transactionOptions.preflightCommitment,
      }
    );

    onSent && onSent(signature, transactionWithContext);
  };

  return {
    getAddressLookupTableAccounts,
    buildTransactionFromWeb3Instructions,
    withErrorHandler,
    simulate: withErrorHandler(simulate),
    send: withErrorHandler(send),
  };
};
