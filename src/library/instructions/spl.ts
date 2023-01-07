import { InstructionLibrary } from "library/instructions/native";

export const SPL_INSTRUCTIONS: InstructionLibrary = {
  /// Memo ///
  "SPL.Memo.v2": {
    program: "Memo v2 (SPL)",
    instruction: {
      name: "Memo v2",
      programId: "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr",
      accounts: [],
      data: {
        format: "raw",
        value: {
          encoding: "utf8",
          content: "",
        },
      },
    },
  },

  /// Token ///
  // TODO

  /// Token 2022 ///
  // TODO

  /// Token Swap ///
  // TODO

  /// Token Lending ///
  // TODO

  /// Associated Token Account ///
  // TODO

  /// Token Upgrade ///
  // TODO

  /// Name Service ///
  // TODO

  /// Shared Memory ///
  // TODO

  /// Stake Pool ///
  // TODO

  /// Feature Proposal ///
  // TODO
};
