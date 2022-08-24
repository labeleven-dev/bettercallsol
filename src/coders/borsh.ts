import * as Borsh from "@project-serum/borsh";
import { PublicKey } from "@solana/web3.js";
import { Coder } from ".";
import { IInstrctionDataField } from "../types/internal";

export class BorshCoder implements Coder {
  encode(fields: IInstrctionDataField[]): Buffer {
    const layout = Borsh.struct(fields.map(mapToLayout));

    const values = fields.reduce((acc, { name, type, value }) => {
      let encoded = value;

      if (type === "publicKey") {
        encoded = new PublicKey(encoded);
      }

      acc[name!] = encoded;
      return acc;
    }, {} as Record<string, any>);

    // TODO this is how Anchor does it atm https://github.com/coral-xyz/anchor/blob/5a025b949e67bf424a30641028973f00325b8f1e/ts/packages/anchor/src/coder/borsh/accounts.ts#L46
    // const buffer = Buffer.alloc(layout.span);
    const buffer = Buffer.alloc(1000);
    layout.encode(values, buffer);
    return buffer;
  }
}

const mapToLayout = ({
  type,
  name,
}: IInstrctionDataField): Borsh.Layout<any> => {
  switch (type) {
    case "u8":
      return Borsh.u8(name);
    case "i8":
      return Borsh.i8(name);
    case "u16":
      return Borsh.u16(name);
    case "i16":
      return Borsh.i16(name);
    case "u32":
      return Borsh.u32(name);
    case "i32":
      return Borsh.i32(name);
    case "u64":
      return Borsh.u64(name);
    case "i64":
      return Borsh.i64(name);
    case "bool":
      return Borsh.bool(name);
    case "publicKey":
      return Borsh.publicKey(name);
    case "bytes":
      return Borsh.vecU8(name);
    case "string":
      return Borsh.str(name);
  }

  // TODO complex types

  throw new Error(`Cannot determine layout for: ${name} with type ${type}`);
};
