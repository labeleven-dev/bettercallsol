// Models for the transaction to be exported

import {
  DataFormat,
  InstructionDataFieldType,
  IPubKey,
} from "./internal-types";

export interface IInstrctionDataFieldExt {
  name?: string;
  description?: string;
  type: InstructionDataFieldType;
  value: any;
}

export interface IAccountExt {
  name?: string;
  description?: string;
  pubkey: IPubKey;
  isWritable: boolean;
  isSigner: boolean;
}

export interface IInstructionExt {
  name?: string;
  description?: string;
  programId: IPubKey;
  accounts: IAccountExt[];
  data: {
    format: DataFormat;
    value: IInstrctionDataFieldExt[] | string;
  };
}

export interface ITransactionExt {
  name?: string;
  description?: string;
  instructions: IInstructionExt[];
}

// TODO add required fields for validation
export const JSON_SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string" },
    description: { type: "string" },
    instructions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          programId: { type: "string" },
          accounts: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                pubkey: { type: "string" },
                isWritable: { type: "boolean" },
                isSigner: { type: "boolean" },
              },
            },
          },
          data: {
            type: "object",
            properties: {
              format: {
                type: "string",
                enum: ["raw", "bufferLayout", "borsh"],
              },
              value: {
                anyOf: [
                  { type: "string" },
                  {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      description: { type: "string" },
                      type: {
                        type: "string",
                        enum: [
                          "string",
                          "u8",
                          "i8",
                          "u16",
                          "i16",
                          "u32",
                          "i32",
                          "u64",
                          "i64",
                          "bool",
                          "publicKey",
                        ],
                      },
                      value: { type: "string" },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
  },
};
