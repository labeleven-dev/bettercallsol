import { useToast } from "@chakra-ui/react";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey } from "@solana/web3.js";
import { useAccount } from "hooks/useAccount";
import { useInstruction } from "hooks/useInstruction";
import { useSessionStoreWithUndo } from "hooks/useSessionStore";
import { AccountType, IAccountMetadata } from "types/internal";
import { isValidPublicKey } from "utils/web3js";

/**
 * Encapsulates logic to populate accounts based on their type
 */
export const useAccountType = (): {
  type: AccountType;
  metadata?: IAccountMetadata;
  populate: () => void;
  isConfigurable: boolean;
  allPopulate: Record<AccountType, () => void>;
} => {
  const { useGet: instructionGet } = useInstruction();
  const { useShallowGet, update: accountUpdate } = useAccount();
  const setSession = useSessionStoreWithUndo((state) => state.set);
  const { publicKey: walletPublicKey } = useWallet();
  const toast = useToast();

  const programId = instructionGet((state) => state.programId);
  const [type, metadata] = useShallowGet((state) => [
    state.type,
    state.metadata,
  ]);

  ///// Populate functions /////

  const wallet = () => {
    if (!walletPublicKey) {
      toast({
        title: "Wallet not connected!",
        description: "Please use the top-right button to connect one.",
        status: "error",
        duration: 8000,
        isClosable: true,
      });
      return;
    }

    accountUpdate((state) => {
      state.pubkey = walletPublicKey.toBase58();
    });
  };

  const keypair = () => {
    const keypair = Keypair.generate();
    const publicKey = keypair.publicKey.toBase58();

    setSession((state) => {
      state.keypairs[publicKey] = keypair.secretKey;
    });

    accountUpdate((state) => {
      state.pubkey = publicKey;
    });

    toast({
      title: "Keypair has been successfully created!",
      description:
        "Private keys are stored in memory only. They will not survive page reloads.",
      status: "info",
      duration: 8000,
      isClosable: true,
    });
  };

  const pda = () => {
    const seeds = metadata?.seeds;
    // TODO needed?
    if (!seeds) {
      return;
    }

    if (!isValidPublicKey(programId)) {
      toast({
        title: "Cannot create PDA",
        description: "The instruction needs a program ID",
        status: "error",
        duration: 8000,
        isClosable: true,
      });
      return;
    }

    const [pubkey, bump] = PublicKey.findProgramAddressSync(
      seeds.map((x) => Buffer.from(x)),
      new PublicKey(programId)
    );

    accountUpdate((state) => {
      state.pubkey = pubkey.toBase58();
      state.metadata = { seeds, bump };
    });
  };

  const ata = () => {
    const mint = metadata?.mint;
    // TODO is it needed?
    if (!mint) {
      return;
    }

    if (!walletPublicKey) {
      toast({
        title: "Wallet not connected!",
        description: "Please use the top-right button to connect one.",
        status: "error",
        duration: 8000,
        isClosable: true,
      });
      return;
    }

    const ata = getAssociatedTokenAddressSync(
      new PublicKey(mint),
      walletPublicKey
    );

    accountUpdate((state) => {
      state.pubkey = ata.toBase58();
    });
  };

  const program = () => {
    // TODO
  };

  const sysvar = () => {
    // TODO
  };

  return {
    type,
    metadata: metadata,
    isConfigurable: type === "pda" || type === "ata",
    populate:
      type === "wallet"
        ? wallet
        : type === "keypair"
        ? keypair
        : type === "pda"
        ? pda
        : type === "ata"
        ? ata
        : type === "program"
        ? program
        : type === "sysvar"
        ? sysvar
        : () => {},
    allPopulate: {
      wallet,
      keypair,
      pda,
      ata,
      program,
      sysvar,
      unspecified: () => {},
    },
  };
};
