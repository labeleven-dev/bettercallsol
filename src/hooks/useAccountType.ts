import { useToast } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey } from "@solana/web3.js";
import { WritableDraft } from "immer/dist/internal";
import {
  AccountTypeConfig,
  AccountTypeType,
  IAccountType,
  IAccountTypeConfigPda,
} from "../types/internal";
import { isValidPublicKey } from "../utils/web3js";
import { useAccount } from "./useAccount";
import { useInstruction } from "./useInstruction";
import { useSessionStoreWithUndo } from "./useSessionStore";

/**
 * Encapsulates logic to populate accounts based on their type
 */
export const useAccountType = (): {
  type: AccountTypeType;
  config?: AccountTypeConfig;
  update: (fn: (state: WritableDraft<IAccountType>) => void) => void;
  populate: () => void;
  isConfigurable: boolean;
  allPopulate: Record<AccountTypeType, () => void>;
} => {
  const { useGet: instructionGet } = useInstruction();
  const { useShallowGet, update: accountUpdate } = useAccount();
  const setSession = useSessionStoreWithUndo((state) => state.set);
  const { publicKey: walletPublicKey } = useWallet();
  const toast = useToast();

  const programId = instructionGet((state) => state.programId);
  const [type, config] = useShallowGet((state) => [
    state.type.type,
    state.type.config,
  ]);

  const update = (fn: (state: WritableDraft<IAccountType>) => void) => {
    accountUpdate((state) => {
      fn(state.type);
    });
  };

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
    const seeds = (config as IAccountTypeConfigPda)?.seeds;
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
      state.type.config = { seeds, bump } as IAccountTypeConfigPda;
    });
  };

  const ata = () => {
    // TODO
  };

  const program = () => {
    // TODO
  };

  const sysvar = () => {
    // TODO
  };

  return {
    type,
    config,
    isConfigurable: type === "pda" || type === "ata",
    update,
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
