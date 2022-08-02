import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Signer } from "@solana/web3.js";
import { ITransaction } from "../models/internal-types";
import { mapToTransaction } from "../models/web3js-mappers";
import { usePersistentStore } from "./usePersistentStore";
import { useSessionStoreWithUndo } from "./useSessionStore";

export const useSendWeb3Transaction = ({
  onSent,
  onError,
}: {
  onSent?: (signature: string) => void;
  onError?: (error: Error) => void;
}): {
  send: (transaction: ITransaction) => void;
} => {
  const transactionOptions = usePersistentStore(
    (state) => state.transactionOptions
  );
  const { keypairs } = useSessionStoreWithUndo((state) => state);

  const { connection } = useConnection();
  const { sendTransaction } = useWallet();

  // send the transaction to the chain
  const send = (transaction: ITransaction) => {
    if (
      !transaction.instructions.map ||
      Object.values(transaction.instructions.map).every((x) => x.disabled)
    ) {
      onError && onError(new Error("No instructions provider"));
      return;
    }

    try {
      const web3Transaction = mapToTransaction(transaction);

      // add additional signers
      const signerPubkeys = Object.values(transaction.instructions.map)
        .flatMap((instruction) => Object.values(instruction.accounts.map))
        .filter((account) => account.isSigner && keypairs[account.pubkey])
        .map((account) => account.pubkey);

      const additionalSigners = [...new Set(signerPubkeys)].map(
        (pubkey) =>
          ({
            publicKey: new PublicKey(pubkey),
            secretKey: keypairs[pubkey],
          } as Signer)
      );

      sendTransaction(web3Transaction, connection, {
        signers: additionalSigners || undefined,
        skipPreflight: transactionOptions.skipPreflight,
        maxRetries: transactionOptions.maxRetries,
        preflightCommitment: transactionOptions.preflightCommitment,
      }).then((signature) => {
        onSent && onSent(signature);
      });
    } catch (err) {
      onError && onError(new Error((err as { message: string }).message));
    }
  };

  return { send };
};
