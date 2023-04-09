import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Signer } from "@solana/web3.js";
import { useSessionStoreWithUndo } from "hooks/useSessionStore";
import {
  TransactionBuilderArgs,
  Web3TransactionWithContext,
  useWeb3TransactionBuilder,
} from "hooks/useWeb3TranasctionBuilder";
import { mapITransactionToWeb3Instructions } from "mappers/internal-to-web3js";
import { ITransaction } from "types/internal";

/**
 * Use it to send transactions to Solana
 */
export const useSendWeb3Transaction = (
  args: TransactionBuilderArgs
): {
  simulate: (transaction: ITransaction) => void;
  send: (transaction: ITransaction) => void;
} => {
  const { wallet } = useWallet();
  const keypairs = useSessionStoreWithUndo((state) => state.keypairs);

  const {
    getAddressLookupTableAccounts,
    buildTransactionFromWeb3Instructions,
    withErrorHandler,
    simulate: simulateWeb3Transation,
    send: sendWeb3Transaction,
  } = useWeb3TransactionBuilder(args);

  // convert from ITransaction to VersionedTransaction
  const buildTransactionfromITransaction = async (
    transaction: ITransaction
  ): Promise<Web3TransactionWithContext | undefined> => {
    if (
      !transaction.instructions.map ||
      Object.values(transaction.instructions.map).every((x) => x.disabled)
    ) {
      throw new Error("No instructions provided");
    }

    if (
      !wallet?.adapter?.supportedTransactionVersions?.has(transaction.version)
    ) {
      throw new Error(
        `Wallet does not support versioned transactions or version ${transaction.version} specifically`
      );
      return;
    }

    // message
    const transactionWithContext = await buildTransactionFromWeb3Instructions(
      mapITransactionToWeb3Instructions(transaction),
      await getAddressLookupTableAccounts(transaction),
      transaction.version
    );
    if (!transactionWithContext) return;

    const { transaction: web3Transaction } = transactionWithContext;

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

    return transactionWithContext;
  };

  // simulate transaction
  const simulate = async (transaction: ITransaction) => {
    let transactionWithContext = await buildTransactionfromITransaction(
      transaction
    );
    if (!transactionWithContext) return;

    simulateWeb3Transation(transactionWithContext);
  };

  // send the transaction to the chain
  const send = async (transaction: ITransaction) => {
    const transactionWithContext = await buildTransactionfromITransaction(
      transaction
    );
    if (!transactionWithContext) return;
    sendWeb3Transaction(transactionWithContext);
  };

  return {
    simulate: withErrorHandler(simulate),
    send: withErrorHandler(send),
  };
};
