import {
  ClockworkProvider,
  TriggerInput,
  parseTransactionInstructions,
} from "@clockwork-xyz/sdk";
import { AnchorProvider, BN } from "@project-serum/anchor";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { TransactionInstruction } from "@solana/web3.js";
import { useSessionStoreWithUndo } from "hooks/useSessionStore";
import { useWeb3Connection } from "hooks/useWeb3Connection";
import {
  TransactionBuilderArgs,
  useWeb3TransactionBuilder,
} from "hooks/useWeb3TranasctionBuilder";
import { mapITransactionToWeb3Instructions } from "mappers/internal-to-web3js";
import { ITransaction } from "types/internal";
import { toPublicKey } from "utils/web3js";

export const useSendToClockwork = (
  args: TransactionBuilderArgs
): {
  simulate: (transaction: ITransaction) => void;
  send: (transaction: ITransaction) => void;
} => {
  const {
    threadId,
    amount,
    fee,
    rateLimit,
    trigger,
    accountTrigger,
    cronTrigger,
    epochTrigger,
    slotTrigger,
  } = useSessionStoreWithUndo((state) => state.clockworkConfig);

  const connection = useWeb3Connection();
  const anchorWallet = useAnchorWallet();

  const {
    getAddressLookupTableAccounts,
    buildTransactionFromWeb3Instructions,
    withErrorHandler,
    simulate: simulateWeb3Transation,
    send: sendWeb3Transaction,
  } = useWeb3TransactionBuilder(args);

  const buildTransaction = async (transaction: ITransaction) => {
    if (!anchorWallet) {
      throw new Error("Wallet not connected");
    }
    if (!threadId) {
      throw new Error("No Clockwork Thread ID has been defined");
    }

    const anchorProvider = new AnchorProvider(connection, anchorWallet, {});
    const provider = ClockworkProvider.fromAnchorProvider(anchorProvider);

    const triggerInput: TriggerInput =
      trigger === "account"
        ? {
            account: {
              address: toPublicKey(
                accountTrigger.address,
                "Clockwork account trigger's address"
              ),
              offset: new BN(accountTrigger.offset),
              size: new BN(accountTrigger.size),
            },
          }
        : trigger === "cron"
        ? {
            cron: cronTrigger,
          }
        : trigger === "now"
        ? { now: {} }
        : trigger === "slot"
        ? { slot: slotTrigger }
        : { epoch: epochTrigger };

    const threadInstructions = mapITransactionToWeb3Instructions(transaction);
    const threadPda = provider.getThreadPDA(
      anchorWallet.publicKey,
      threadId
    )[0];
    const account = await connection.getAccountInfo(threadPda);

    const instructions: TransactionInstruction[] = [];
    if (account) {
      instructions.push(
        await provider.threadUpdate(anchorWallet.publicKey, threadPda, {
          fee: fee === "" ? undefined : fee,
          rateLimit: rateLimit === "" ? undefined : rateLimit,
          instructions: parseTransactionInstructions(threadInstructions),
          trigger: triggerInput,
        })
      );
    } else {
      instructions.push(
        await provider.threadCreate(
          anchorWallet.publicKey,
          threadId,
          threadInstructions,
          triggerInput,
          amount
        )
      );

      // not sure why these are not available on the create operation...
      if (fee !== "" || rateLimit !== "") {
        instructions.push(
          await provider.threadUpdate(anchorWallet.publicKey, threadPda, {
            fee: fee === "" ? undefined : fee,
            rateLimit: rateLimit === "" ? undefined : rateLimit,
          })
        );
      }
    }

    return await buildTransactionFromWeb3Instructions(
      instructions,
      await getAddressLookupTableAccounts(transaction),
      transaction.version
    );
  };

  const simulate = async (transaction: ITransaction) => {
    const transactionWithContext = await buildTransaction(transaction);
    if (!transactionWithContext) return;

    simulateWeb3Transation(transactionWithContext);
  };

  const send = async (transaction: ITransaction) => {
    const transactionWithContext = await buildTransaction(transaction);
    if (!transactionWithContext) return;

    sendWeb3Transaction(transactionWithContext);
  };

  return {
    simulate: withErrorHandler(simulate),
    send: withErrorHandler(send),
  };
};
