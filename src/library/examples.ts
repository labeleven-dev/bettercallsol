import { ITransactionExt } from "../types/external";

// TODO add an Anchor example

export const EXAMPLES: Record<string, ITransactionExt> = {
  systemProgramCreateAccount: {
    version: "1.0.0",
    network: "devnet",
    name: "System Program: Create Account",
    description: `This transaction demonstrates how to use Solana's native [System Program](https://docs.solana.com/developing/runtime-facilities/programs#system-program) to create a Solana account.

1. Connect a wallet (preferably a burner wallet) using the button at the top right
1. Populate the "Payer" account by clicking on the green 🪄
1. Airdrop 🪂 some funds to your wallet if required (only in devnet/testnet)
1. Populate the "New Account" account with a new keypair by clicking on the green 🪄
1. Send!`,
    instructions: [
      {
        name: "Create Account",
        description: `Programs are called as part of an instruction, along with relevant accounts and instruction data.`,
        programId: "11111111111111111111111111111111",
        accounts: [
          {
            type: "wallet",
            description: `The wallet that signs and pays for the transaction.`,
            name: "Payer",
            pubkey: "",
            isWritable: true,
            isSigner: true,
          },
          {
            type: "keypair",
            description: `The new account's public key. It also needs to sign the transaction.`,
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
              description: `System program looks at this field to figure out which instruction is being invoked.
                
The number corresponds to [\`SystemInstruction\`](https://github.com/solana-labs/solana/blob/242bd9be0d9e92e01814decd484e97d9d9254f2e/sdk/program/src/system_instruction.rs#L163) enum, in this case \`SystemInstruction::CreateAccount\`.`,
              type: "u32",
              value: 0,
            },
            {
              name: "Lamport",
              description: `The amount of lamports to be transfered to the account. 
              
We are putting in 140000 lamports, which is the amount to make a 64 byte account [rent-exempt](https://docs.solana.com/developing/programming-model/accounts#rent-exemption).`,
              type: "u64",
              value: 1400000,
            },
            {
              name: "Space",
              description: `The size of the account in bytes.`,
              type: "u64",
              value: 64,
            },
            {
              name: "Program ID",
              description: `The account that should be set as the owner.`,
              type: "publicKey",
              value: "11111111111111111111111111111111",
            },
          ],
        },
      },
    ],
  },

  systemProgramTransfer: {
    version: "1.0.0",
    network: "devnet",
    name: "System Program: Transfer",
    description: `This transaction demonstrates how to use Solana's native [System Program](https://docs.solana.com/developing/runtime-facilities/programs#system-program) to transfer some funds between accounts.

1. Connect a wallet (preferably a burner wallet) using the button at the top right
1. Populate the "From" account by clicking on the green 🪄
1. Airdrop 🪂 some funds to your wallet if required (only in devnet/testnet)
1. Send!`,
    instructions: [
      {
        name: "Transfer",
        description: `Programs are called as part of an instruction, along with relevant accounts and instruction data.`,
        programId: "11111111111111111111111111111111",
        accounts: [
          {
            type: "wallet",
            name: "From",
            description: `The wallet where funds come from (your wallet!), also pays for the transation (note "Signer" is toggled to the left).`,
            pubkey: "",
            isWritable: true,
            isSigner: true,
          },
          {
            type: "unspecified",
            name: "To",
            description: `The wallet where the funds go to. This is just a random one, you can change it if you like.`,
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
              description: `System program looks at this field to figure out which instruction is being invoked.
                
The number corresponds to [\`SystemInstruction\`](https://github.com/solana-labs/solana/blob/242bd9be0d9e92e01814decd484e97d9d9254f2e/sdk/program/src/system_instruction.rs#L163) enum, in this case \`SystemInstruction::Transfer\`.`,
              type: "u32",
              value: 2,
            },
            {
              name: "Lamport",
              description: `The amount of lamports to transfer.
                
_A lamport is 0.000,000,001 SOL._`,
              type: "u64",
              value: 100_000,
            },
          ],
        },
      },
    ],
  },
};
