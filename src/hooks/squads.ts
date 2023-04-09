import { AnchorProvider, BN, Program } from "@project-serum/anchor";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey } from "@solana/web3.js";
import Squads, { getTxPDA } from "@sqds/sdk";
import SquadsMplIdl from "@sqds/sdk/lib/idl/squads_mpl.json";
import { SquadsMpl } from "@sqds/sdk/lib/target/types/squads_mpl";
import { useSessionStoreWithUndo } from "hooks/useSessionStore";
import { useWeb3Connection } from "hooks/useWeb3Connection";
import {
  TransactionBuilderArgs,
  useWeb3TransactionBuilder,
} from "hooks/useWeb3TranasctionBuilder";
import { mapITransactionToWeb3Instructions } from "mappers/internal-to-web3js";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { ITransaction } from "types/internal";
import { isValidPublicKey } from "utils/web3js";

export const useTransactionPda = (
  programId: string,
  multisig: string,
  onSuccess?: (data: PublicKey | undefined) => void,
  enabled = true
) => {
  const connection = useWeb3Connection();
  const anchorProvider = useMemo(
    () =>
      new AnchorProvider(connection, new NodeWallet(Keypair.generate()), {}),
    [connection]
  );

  return useQuery<PublicKey | undefined>(
    // avoid re-rending due to array getting recreated :(
    useMemo(
      () => ["squadsTransactionPda", programId, multisig],
      [programId, multisig]
    ),
    async () => {
      if (!isValidPublicKey(programId) || !isValidPublicKey(multisig)) return;

      const multisigAccount = await new Program<SquadsMpl>(
        SquadsMplIdl as SquadsMpl,
        new PublicKey(programId),
        anchorProvider
      ).account.ms.fetch(new PublicKey(multisig));
      const [pda] = getTxPDA(
        new PublicKey(multisig),
        new BN(multisigAccount.transactionIndex + 1, 10),
        new PublicKey(programId)
      );

      return pda;
    },
    {
      enabled,
      onSuccess,
    }
  );
};

export const useSendToSquads = (
  args: TransactionBuilderArgs
): {
  simulate: (transaction: ITransaction) => void;
  send: (transaction: ITransaction) => void;
} => {
  const { programId, multisig, authorityIndex, activateTransaction } =
    useSessionStoreWithUndo((state) => state.squadsConfig);

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

    const anchorProvider = new AnchorProvider(connection, anchorWallet, {});
    const programPubkey = new PublicKey(programId);
    const multisigPda = new PublicKey(multisig);

    const squads = new Squads({
      connection: anchorProvider.connection,
      wallet: anchorProvider.wallet,
      multisigProgramId: programPubkey,
    });
    const mpl = new Program<SquadsMpl>(
      SquadsMplIdl as SquadsMpl,
      programPubkey,
      anchorProvider
    );

    const builder = await squads.getTransactionBuilder(
      multisigPda,
      authorityIndex
    );

    const [instructions] = await builder
      .withInstructions(mapITransactionToWeb3Instructions(transaction))
      .getInstructions();

    if (activateTransaction) {
      instructions.push(
        await mpl.methods
          .activateTransaction()
          .accounts({
            multisig: multisigPda,
            transaction: builder.transactionPDA(),
            creator: anchorProvider.wallet.publicKey,
          })
          .instruction()
      );
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
