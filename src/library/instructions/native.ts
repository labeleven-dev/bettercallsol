import { IInstructionExt } from "types/external";

export type InstructionLibrary = Record<
  string,
  {
    program: string;
    instruction: IInstructionExt & { name: string }; // make name mandatory
  }
>;

export const NATIVE_INSTRUCTIONS: InstructionLibrary = {
  /// Compute Budget ///

  "Native.ComputeBudget.RequestUnits": {
    program: "Compute Budget (Native)",
    instruction: {
      name: "Compute Budget: Request Units (Deprecated)",
      programId: "ComputeBudget111111111111111111111111111111",
      accounts: [],
      data: {
        format: "bufferLayout",
        value: [
          {
            name: "Instruction",
            description: "Index of the instruction",
            type: "u8",
            value: 0,
          },
          {
            name: "Units",
            type: "u32",
            value: 0,
          },
          {
            name: "Additional Fee",
            type: "u32",
            value: 0,
          },
        ],
      },
    },
  },

  // TODO Native.ComputeBudget.RequestHeapFrame

  "Native.ComputeBudget.SetComputeUnitLimit": {
    program: "Compute Budget (Native)",
    instruction: {
      name: "Compute Budget: Set Compute Unit Limit",
      programId: "ComputeBudget111111111111111111111111111111",
      accounts: [],
      data: {
        format: "bufferLayout",
        value: [
          {
            name: "Instruction",
            description: "Index of the instruction",
            type: "u8",
            value: 2,
          },
          {
            name: "Units",
            type: "u32",
            value: 0,
          },
        ],
      },
    },
  },

  "Native.ComputeBudget.SetComputeUnitPrice": {
    program: "Compute Budget (Native)",
    instruction: {
      name: "Compute Budget: Set Compute Unit Price",
      programId: "ComputeBudget111111111111111111111111111111",
      accounts: [],
      data: {
        format: "bufferLayout",
        value: [
          {
            name: "Instruction",
            description: "Index of the instruction",
            type: "u8",
            value: 3,
          },
          {
            name: "Price",
            description: "In micro-lamports",
            type: "u64",
            value: 0,
          },
        ],
      },
    },
  },

  // TODO Native.ComputeBudget.SetAccountsDataSizeLimit

  /// System Program ///

  "Native.System.CreateAccount": {
    program: "System Program (Native)",
    instruction: {
      name: "System Program: Create Account",
      programId: "11111111111111111111111111111111",
      accounts: [
        {
          type: "wallet",
          description: "The wallet that signs and pays for the transaction",
          name: "Payer",
          pubkey: "",
          isWritable: true,
          isSigner: true,
        },
        {
          type: "keypair",
          description:
            "The new account's public key. It also needs to sign the transaction",
          name: "New Account",
          pubkey: "",
          isWritable: true,
          isSigner: true,
        },
      ],
      data: {
        format: "bufferLayout",
        value: [
          {
            name: "Instruction",
            description: "Index of the instruction",
            type: "u32",
            value: 0,
          },
          {
            name: "Lamport",
            description:
              "The amount of lamports to be transfered to the account",
            type: "u64",
            value: 0,
          },
          {
            name: "Space",
            description: "The size of the account in bytes",
            type: "u64",
            value: 0,
          },
          {
            name: "Program ID",
            description: "The account that should be set as the owner",
            type: "publicKey",
            value: "",
          },
        ],
      },
    },
  },

  "Native.System.Assign": {
    program: "System Program (Native)",
    instruction: {
      name: "System Program: Assign",
      programId: "11111111111111111111111111111111",
      accounts: [
        {
          type: "keypair",
          name: "Account",
          pubkey: "",
          isWritable: true,
          isSigner: true,
        },
      ],
      data: {
        format: "bufferLayout",
        value: [
          {
            name: "Instruction",
            description: "Index of the instruction",
            type: "u32",
            value: 0,
          },
          {
            name: "Program ID",
            description: "The account that should be set as the owner",
            type: "publicKey",
            value: "",
          },
        ],
      },
    },
  },

  "Native.System.Transfer": {
    program: "System Program (Native)",
    instruction: {
      name: "System Program: Transfer",
      programId: "11111111111111111111111111111111",
      accounts: [
        {
          type: "wallet",
          name: "From",
          pubkey: "",
          isWritable: true,
          isSigner: true,
        },
        {
          type: "unspecified",
          name: "To",
          pubkey: "",
          isWritable: true,
          isSigner: false,
        },
      ],
      data: {
        format: "bufferLayout",
        value: [
          {
            name: "Instruction",
            description: "Index of the instruction",
            type: "u32",
            value: 2,
          },
          {
            name: "Lamport",
            description: "The amount of lamports to transfer",
            type: "u64",
            value: 0,
          },
        ],
      },
    },
  },

  // TODO Native.System.CreateAccountWithSeed
  // TODO Native.System.AdvanceNonceAccount
  // TODO Native.System.WithdrawNonceAccount
  // TODO Native.System.InitializeNonceAccount
  // TODO Native.System.AuthorizeNonceAccount
  // TODO Native.System.Allocate
  // TODO Native.System.AllocateWithSeed
  // TODO Native.System.AssignWithSeed
  // TODO Native.System.TransferWithSeed
  // TODO Native.System.UpgradeNonceAccount

  /// Config ///
  // TODO Config1111111111111111111111111111111111111

  // TODO Native.Config.CreateAccount
  // TODO Native.Config.Store

  /// Stake ///
  // TODO Stake11111111111111111111111111111111111111

  /// Vote ///
  // TODO Vote111111111111111111111111111111111111111

  /// BPF Loader ///
  // TODO BPFLoaderUpgradeab1e11111111111111111111111

  /// Ed25519 ///
  // TODO Ed25519SigVerify111111111111111111111111111

  /// Secp256k1 ///
  // TODO KeccakSecp256k11111111111111111111111111111
};
