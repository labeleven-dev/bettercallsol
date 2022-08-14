import * as Borsh from "@project-serum/borsh";
import { Coder } from ".";
import { IInstrctionDataField } from "../types/internal";

export class BorshCoder implements Coder {
  encode(fields: IInstrctionDataField[]): Buffer {
    const layout = Borsh.struct(fields.map(mapToLayout));
    const values = fields.reduce((acc, { name, value }) => {
      acc[name!] = value;
      return acc;
    }, {} as Record<string, any>);

    const buffer = Buffer.alloc(layout.span);
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
