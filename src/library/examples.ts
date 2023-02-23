import { ITransactionExt } from "types/external";

export const EXAMPLES: Record<string, ITransactionExt> = {
  memoV2Program: {
    version: "1.0.0",
    txnVersion: "0",
    network: "devnet",
    name: "Memo v2",
    description: `Send a memo to the chain, using [Memo v2 SPL program](https://spl.solana.com/memo).

1. Connect a wallet (preferably a burner wallet) using the button at the top right
1. Update the instruction body if you want
1. Send!
    `,
    addressLookupTables: [],
    instructions: [
      {
        name: "Memo v2",
        programId: "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr",
        description: `Programs are called as part of an instruction, along with relevant accounts and instruction data.`,
        accounts: [],
        data: {
          format: "raw",
          value: {
            encoding: "utf8",
            content: "Hello World",
            description: "Content of the memo",
          },
        },
      },
    ],
  },
  systemProgramCreateAccount: {
    version: "1.0.0",
    txnVersion: "0",
    network: "devnet",
    name: "System Program: Create Account",
    description: `This transaction demonstrates how to use Solana's native [System Program](https://docs.solana.com/developing/runtime-facilities/programs#system-program) to create a Solana account.

1. Connect a wallet (preferably a burner wallet) using the button at the top right
1. Populate the "Payer" account by clicking on the green 🪄
1. Airdrop 🪂 some funds to your wallet if required (only in devnet/testnet)
1. Populate the "New Account" account with a new keypair by clicking on the green 🪄
1. Send!`,
    addressLookupTables: [],
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
    txnVersion: "0",
    network: "devnet",
    name: "System Program: Transfer",
    description: `This transaction demonstrates how to use Solana's native [System Program](https://docs.solana.com/developing/runtime-facilities/programs#system-program) to transfer some funds between accounts.

1. Connect a wallet (preferably a burner wallet) using the button at the top right
1. Populate the "From" account by clicking on the green 🪄
1. Airdrop 🪂 some funds to your wallet if required (only in devnet/testnet)
1. Send!`,
    addressLookupTables: [],
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

  anchorSquads: {
    version: "1.0.0",
    txnVersion: "0",
    network: "devnet",
    name: "Anchor: Squads",
    description: `If an Anchor program has an on-chain IDL, _Better Call Sol_ can help you invoke it.
    
For this example, we are using [Squads MPL](https://squads.so/), a popular multisig program. We have pre-populated the program ID for you.

The tool detects the IDL and see shows ⚓ icon in the Program field.

1. Click on this button to get a list of possible instructions to pre-populate.
1. Eject out of Anchor instruction into a plain one by clicking ⏏️ button next to the _Anchor Method_ field.
1. Once you eject, you will see that the tool can also detect an Anchor program instruction. Convert back using the 🔁 button, next to the "Detected Anchor Method".

The latter is particularly useful when you import a transaction from the chain.`,
    addressLookupTables: [],
    instructions: [
      {
        name: "Squads",
        programId: "SMPLecH534NA9acpos4G6x7uf3LWbCAwZQE9e8ZekMu",
        accounts: [],
        data: {
          format: "raw",
          value: {
            encoding: "utf8",
            content: "",
          },
        },
      },
    ],
  },
};
