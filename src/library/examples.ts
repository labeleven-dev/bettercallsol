import { ITransactionExt } from "../types/external";

export const EXAMPLES: Record<
  string,
  {
    transaction: ITransactionExt;
    help: string;
  }
> = {
  systemProgramCreateAccount: {
    transaction: {
      name: "System Program: Create Account",
      instructions: [
        {
          name: "Create Account",
          programId: "11111111111111111111111111111111",
          accounts: [
            {
              type: "wallet",
              name: "Payer",
              pubkey: "",
              isWritable: true,
              isSigner: true,
            },
            {
              type: "keypair",
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
                type: "u32",
                value: 0,
              },
              {
                name: "Lamport",
                type: "u64",
                value: 1400000,
              },
              {
                name: "Space",
                type: "u64",
                value: 64,
              },
              {
                name: "Program ID",
                type: "publicKey",
                value: "11111111111111111111111111111111",
              },
            ],
          },
        },
      ],
    },
    help:
      'Press the wand on "Payer" and "New Account" accounts. ' +
      'Then click the "Send" button!',
  },

  systemProgramTransfer: {
    transaction: {
      name: "System Program: Transfer",
      instructions: [
        {
          name: "Transfer",
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
              pubkey: "GoctE4EU5jZqbWg1Ffo5sjCqjrnzW1m76JmWwd84pwtV",
              isWritable: true,
              isSigner: false,
            },
          ],
          data: {
            format: "bufferLayout",
            value: [
              {
                name: "Instruction",
                type: "u32",
                value: 2,
              },
              {
                name: "Lamport",
                type: "u64",
                value: 100_000,
              },
            ],
          },
        },
      ],
    },
    help:
      'Click the wand on "From" account to fill in your Wallet address. ' +
      'Optionally, change the "To" account to another address. ' +
      'Then click the "Send" button!',
  },
};
