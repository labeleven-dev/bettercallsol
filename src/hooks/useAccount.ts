import { WritableDraft } from "immer/dist/internal";
import { useContext } from "react";
import { AccountContext } from "../components/client/accounts/Accounts";
import { IAccount, IInstruction } from "../types/internal";
import { IID } from "../types/sortable";
import { useInstruction } from "./useInstruction";

/**
 * Provides the current account's details and methods to interact with it
 */
export const useAccount = (): {
  id: IID | number;
  isAnchor: boolean;
  useGet: <U>(select: (account: IAccount) => U) => U;
  useShallowGet: <U>(select: (account: IAccount) => U) => U;
  update: (fn: (state: WritableDraft<IAccount>) => void) => void;
} => {
  const {
    useGet: ixnUseGet,
    useShallowGet: ixnUseShallowGet,
    update: ixnUpdate,
  } = useInstruction();
  const { id, isAnchor } = useContext(AccountContext);

  const getter = (instruction: IInstruction): IAccount => {
    return isAnchor
      ? instruction.anchorAccounts![id as number]
      : instruction.accounts.map[id];
  };

  const useGet = <U>(select: (acount: IAccount) => U) =>
    ixnUseGet((state) => select(getter(state)));
  const useShallowGet = <U>(select: (acount: IAccount) => U) =>
    ixnUseShallowGet((state) => select(getter(state)));

  const update = (fn: (state: WritableDraft<IAccount>) => void) => {
    ixnUpdate((state) => {
      fn(getter(state));
    });
  };

  return {
    id,
    isAnchor,
    useGet,
    useShallowGet,
    update,
  };
};
