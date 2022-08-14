import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Signer } from "@solana/web3.js";
import { mapITransactionToWeb3Transaction } from "../mappers/internal-to-web3js";
import { ITransaction } from "../types/internal";
import { usePersistentStore } from "./usePersistentStore";
import { useSessionStoreWithUndo } from "./useSessionStore";
import { useWeb3Connection } from "./useWeb3Connection";

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
  const transactionOptions = usePersistentStore(
    (state) => state.transactionOptions
  );
  const keypairs = useSessionStoreWithUndo((state) => state.keypairs);

  const defaultConnection = useWeb3Connection();
  const activeConnection = connection || defaultConnection;
  const { sendTransaction } = useWallet();

  // send the transaction to the chain
  const send = async (transaction: ITransaction) => {
    if (
      !transaction.instructions.map ||
      Object.values(transaction.instructions.map).every((x) => x.disabled)
    ) {
      onError && onError(new Error("No instructions provider"));
      return;
    }

    try {
      const web3Transaction = mapITransactionToWeb3Transaction(transaction);

      // add additional signers
      const signerPubkeys = Object.values(transaction.instructions.map)
        .flatMap((instruction) =>
          (instruction.anchorAccounts || []).concat(
            Object.values(instruction.accounts.map)
          )
        )
        .filter((account) => account.isSigner && keypairs[account.pubkey])
        .map((account) => account.pubkey);

      const additionalSigners = [...new Set(signerPubkeys)].map(
        (pubkey) =>
          ({
            publicKey: new PublicKey(pubkey),
            secretKey: keypairs[pubkey],
          } as Signer)
      );

      const signature = await sendTransaction(
        web3Transaction,
        activeConnection,
        {
          signers: additionalSigners || undefined,
          skipPreflight: transactionOptions.skipPreflight,
          maxRetries: transactionOptions.maxRetries,
          preflightCommitment: transactionOptions.preflightCommitment,
        }
      );

      onSent && onSent(signature);
    } catch (err) {
      const message = Object.getOwnPropertyNames(err).includes("message")
        ? (err as { message: string }).message
        : JSON.stringify(err);
      onError && onError(new Error(message));
    }
  };

  return { send };
};
