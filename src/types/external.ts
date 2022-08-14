// Models for the transaction to be exported

import {
  DataFormat,
  IAccount,
  IInstrctionDataField,
  IPubKey,
} from "./internal";

export type IInstrctionDataFieldExt = Omit<IInstrctionDataField, "id">;

export type IAccountExt = Omit<IAccount, "id">;

export interface IInstructionDataExt {
  format: DataFormat;
  value: IInstrctionDataFieldExt[] | string;
}

export interface IInstructionExt {
  name?: string;
  description?: string;
  programId: IPubKey;
  accounts: IAccountExt[];
  data: IInstructionDataExt;
  anchorMethod?: string;
  anchorAccounts?: IAccountExt[];
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
                    type: "array",
                    items: {
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
                        value: {}, // match any
                      },
                    },
                  },
                ],
              },
            },
          },
          anchorMethod: {
            type: "string",
          },
          anchorAccounts: {
            type: "array",
            // TODO code duplication with the above
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
        },
      },
    },
  },
};
