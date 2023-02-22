import { useToast } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  AddressLookupTableAccount,
  Connection,
  PublicKey,
  RpcResponseAndContext,
  Signer,
  SimulatedTransactionResponse,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { useConfigStore } from "hooks/useConfigStore";
import { useSessionStoreWithUndo } from "hooks/useSessionStore";
import { useWeb3Connection } from "hooks/useWeb3Connection";
import { mapITransactionToWeb3Instructions } from "mappers/internal-to-web3js";
import { ITransaction } from "types/internal";
import { sentryCaptureException } from "utils/sentry";
import { isValidPublicKey } from "utils/web3js";

/**
 * Use it to send transactions to Solana
 */
export const useSendWeb3Transaction = ({
  connection,
  onSimulated,
  onSent,
  onError,
}: {
  connection?: Connection;
  onSimulated?: (
    response: RpcResponseAndContext<SimulatedTransactionResponse>,
    transaction: VersionedTransaction
  ) => void;
  onSent?: (signature: string, transaction: VersionedTransaction) => void;
  onError?: (error: Error) => void;
}): {
  buildTransaction: (
    transaction: ITransaction
  ) => Promise<VersionedTransaction | undefined>;
  simulate: (transaction: ITransaction) => void;
  send: (transaction: ITransaction) => void;
} => {
  const transactionOptions = useConfigStore(
    (state) => state.transactionOptions
  );
  const keypairs = useSessionStoreWithUndo((state) => state.keypairs);

  const toast = useToast();

  const defaultConnection = useWeb3Connection();
  const activeConnection = connection || defaultConnection;
  const {
    publicKey: payerKey,
    sendTransaction,
    signTransaction,
    wallet,
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

  // convert from ITransaction to VersionedTransaction
  const buildTransaction = async (
    transaction: ITransaction
  ): Promise<VersionedTransaction | undefined> => {
    if (
      !transaction.instructions.map ||
      Object.values(transaction.instructions.map).every((x) => x.disabled)
    ) {
      onError && onError(new Error("No instructions provided"));
      return;
    }

    if (!payerKey) {
      onError && onError(new Error("Wallet not connected"));
      return;
    }

    if (
      !wallet?.adapter?.supportedTransactionVersions?.has(transaction.version)
    ) {
      onError &&
        onError(
          new Error(
            `Wallet does not support versioned transactions or version ${transaction.version} specifically`
          )
        );
      return;
    }

    // message
    const message = new TransactionMessage({
      instructions: mapITransactionToWeb3Instructions(transaction),
      payerKey,
      recentBlockhash: (await activeConnection.getLatestBlockhash()).blockhash,
    });

    const web3Transaction = new VersionedTransaction(
      transaction.version === 0
        ? message.compileToV0Message(
            await getAddressLookupTableAccounts(transaction)
          )
        : message.compileToLegacyMessage()
    );

    // add additional signers
    const signerPubkeys = [
      ...new Set(
        Object.values(transaction.instructions.map)
          .flatMap((instruction) =>
            (instruction.anchorAccounts || []).concat(
              Object.values(instruction.accounts.map)
            )
          )
          .filter((account) => account.isSigner && keypairs[account.pubkey])
          .map((account) => account.pubkey)
      ),
    ];

    if (signerPubkeys) {
      web3Transaction.sign(
        signerPubkeys.map(
          (pubkey) =>
            ({
              publicKey: new PublicKey(pubkey),
              secretKey: keypairs[pubkey],
            } as Signer)
        )
      );
    }

    return web3Transaction;
  };

  // simulate transaction
  const simulate = async (transaction: ITransaction) => {
    try {
      let web3Transaction = await buildTransaction(transaction);
      if (!web3Transaction) return;

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

      const accountKeys = web3Transaction.message.getAccountKeys({
        addressLookupTableAccounts: await getAddressLookupTableAccounts(
          transaction
        ),
      });
      const addresses = accountKeys.staticAccountKeys
        .concat(
          (accountKeys.accountKeysFromLookups?.writable || []).concat(
            accountKeys.accountKeysFromLookups?.readonly || []
          )
        )
        .map((account) => account.toBase58());

      const response = await activeConnection.simulateTransaction(
        web3Transaction,
        {
          accounts: {
            encoding: "base64",
            addresses,
          },
          sigVerify:
            transactionOptions.signVerifySimulation &&
            signTransaction !== undefined,
        }
      );

      onSimulated && onSimulated(response, web3Transaction);
    } catch (err) {
      sentryCaptureException(err);
      const message = Object.getOwnPropertyNames(err).includes("message")
        ? (err as { message: string }).message
        : JSON.stringify(err);
      onError && onError(new Error(message));
    }
  };

  // send the transaction to the chain
  const send = async (transaction: ITransaction) => {
    try {
      const web3Transaction = await buildTransaction(transaction);
      if (!web3Transaction) return;

      const signature = await sendTransaction(
        web3Transaction,
        activeConnection,
        {
          skipPreflight: transactionOptions.skipPreflight,
          maxRetries: transactionOptions.maxRetries,
          preflightCommitment: transactionOptions.preflightCommitment,
        }
      );

      onSent && onSent(signature, web3Transaction);
    } catch (err) {
      sentryCaptureException(err);
      const message = Object.getOwnPropertyNames(err).includes("message")
        ? (err as { message: string }).message
        : JSON.stringify(err);
      onError && onError(new Error(message));
    }
  };

  return { buildTransaction, simulate, send };
};
