import { useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  Signer,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { useConfigStore } from "hooks/useConfigStore";
import { useSessionStoreWithUndo } from "hooks/useSessionStore";
import { useWeb3Connection } from "hooks/useWeb3Connection";
import { mapITransactionToWeb3Instructions } from "mappers/internal-to-web3js";
import { ITransaction } from "types/internal";
import { sentryCaptureException } from "utils/sentry";

/**
 * Use it to send transactions to Solana
 */
export const useSendWeb3Transaction = ({
  connection,
  onSent,
  onError,
}: {
  connection?: Connection;
  onSent?: (signature: string) => void;
  onError?: (error: Error) => void;
}): {
  send: (transaction: ITransaction) => void;
} => {
  const transactionOptions = useConfigStore(
    (state) => state.transactionOptions
  );
  const keypairs = useSessionStoreWithUndo((state) => state.keypairs);

  const defaultConnection = useWeb3Connection();
  const activeConnection = connection || defaultConnection;
  const { publicKey: payerKey, sendTransaction, wallet } = useWallet();

  // send the transaction to the chain
  const send = async (transaction: ITransaction) => {
    if (
      !transaction.instructions.map ||
      Object.values(transaction.instructions.map).every((x) => x.disabled)
    ) {
      onError && onError(new Error("No instructions provider"));
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
            `Wallet does not support versioned transactions or ${transaction.version} specifically`
          )
        );
      return;
    }

    try {
      const message = new TransactionMessage({
        instructions: mapITransactionToWeb3Instructions(transaction),
        payerKey,
        recentBlockhash: (await activeConnection.getLatestBlockhash())
          .blockhash,
      });

      const web3Transaction = new VersionedTransaction(
        transaction.version === 0
          ? message.compileToV0Message()
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

      const signature = await sendTransaction(
        web3Transaction,
        activeConnection,
        {
          skipPreflight: transactionOptions.skipPreflight,
          maxRetries: transactionOptions.maxRetries,
          preflightCommitment: transactionOptions.preflightCommitment,
        }
      );

      onSent && onSent(signature);
    } catch (err) {
      sentryCaptureException(err);
      const message = Object.getOwnPropertyNames(err).includes("message")
        ? (err as { message: string }).message
        : JSON.stringify(err);
      onError && onError(new Error(message));
    }
  };

  return { send };
};
