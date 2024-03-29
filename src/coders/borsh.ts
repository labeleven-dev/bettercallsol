import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import * as Borsh from "@project-serum/borsh";
import { PublicKey } from "@solana/web3.js";
import { Coder } from "coders";
import { IInstrctionDataField, IInstructionDataRaw } from "types/internal";

export class BorshCoder implements Coder {
  encode(fields: IInstrctionDataField[]): Buffer {
    // TODO non-unique name is used for layout names - makes errors more user-friendly than id
    const layout = Borsh.struct(fields.map(mapToLayout));

    const values = fields.reduce((acc, { name, type, value }) => {
      let encoded = value;

      if (type === "bytes") {
        encoded = Buffer.from(encoded);
      } else if (type === "publicKey") {
        encoded = new PublicKey(encoded);
      }

      acc[name!] = encoded;
      return acc;
    }, {} as Record<string, any>);

    // TODO this is how Anchor does it atm https://github.com/coral-xyz/anchor/blob/5a025b949e67bf424a30641028973f00325b8f1e/ts/packages/anchor/src/coder/borsh/accounts.ts#L46
    // const buffer = Buffer.alloc(layout.span);
    const buffer = Buffer.alloc(1000);
    const length = layout.encode(values, buffer);
    return buffer.slice(0, length);
  }

  decodeFromRaw(
    { content, encoding }: IInstructionDataRaw,
    fields: IInstrctionDataField[]
  ): IInstrctionDataField[] {
    // TODO non-unique name is used for layout names - makes errors more user-friendly than id
    const layout = Borsh.struct(fields.map(mapToLayout));

    const decoded =
      encoding === "hex"
        ? Buffer.from(content, "hex")
        : encoding === "bs58"
        ? bs58.decode(content)
        : Buffer.from(content, "utf-8");

    return layout.decode(decoded.slice(8)); // strip off anchor method sighash
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
