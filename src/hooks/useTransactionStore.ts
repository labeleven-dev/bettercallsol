import produce from "immer";
import create from "zustand";
import { AppState } from "../state";
import { DEFAULT_NETWORKS, ITransaction } from "../web3";

// TODO just for testing
const temp: ITransaction = {
  name: "Baby's First Transaction",
  instructionOrder: ["aaa"],
  instructions: {
    aaa: {
      id: "aaa",
      name: "Memo",
      programId: "Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo",
      // accountOrder: [],
      // accounts: {},
      accountOrder: ["111"],
      accounts: {
        "111": {
          id: "111",
          name: "Signer",
          pubkey: "EQPzCaaYtoCRqaeHkahZWHaX6kyC6K3ytu9t86WvR4Y3",
          isWritable: true,
          isSigner: true,
        },
      },
      data: "hello",
      disabled: false,
      expanded: true,
    },
  },
};

export const useTransactionStore = create<AppState>((set) => ({
  transactionOptions: {
    network: DEFAULT_NETWORKS[0],
    customNetworks: [],
    skipPreflight: true,
    commitment: "processed",
    preflightCommitment: "processed",
    confirmTransactionInitialTimeout: 30_000,
    confirmTransactionTimeout: 30_000,
    maxRetries: 5,
    disableRetryOnRateLimit: true,
  },
  transaction: temp, // TODO remove
  results: {
    inProgress: false,
    signature: "",
    logs: ["Run a transaction to see logs"],
  },
  appOptions: {
    pollingPeriod: 1_000,
  },
  set: (fn) => set(produce(fn)),
}));
