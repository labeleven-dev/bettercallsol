import { WritableDraft } from "immer/dist/internal";
import { useContext } from "react";
import { AccountContext } from "../components/client/accounts/Accounts";
import { IAccount, IInstruction } from "../types/internal";
import { useInstruction } from "./useInstruction";
import { useSessionStoreWithUndo } from "./useSessionStore";

/**
 * Provides the current account's details and methods to interact with it
 */
export const useAccount = (): {
  account: IAccount;
  isAnchor: boolean;
  instruction: IInstruction;
  update: (fn: (state: WritableDraft<IAccount>) => void) => void;
} => {
  const { instruction } = useInstruction();
  const account = useContext(AccountContext);
  const set = useSessionStoreWithUndo((state) => state.set);

  const anchorIndex = instruction.anchorAccounts?.findIndex(
    (acc) => acc.id === account.id
  );
  const isAnchor = anchorIndex !== undefined && anchorIndex > -1;

  const update = (fn: (state: WritableDraft<IAccount>) => void) => {
    set((state) => {
      const ixn = state.transaction.instructions.map[instruction.id];
      fn(
        isAnchor
          ? ixn.anchorAccounts![anchorIndex]
          : ixn.accounts.map[account.id]
      );
    });
  };

  return {
    account,
    isAnchor,
    instruction,
    update,
  };
};
