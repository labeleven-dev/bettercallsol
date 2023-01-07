import * as BufferLayout from "@solana/buffer-layout";
import { PublicKey } from "@solana/web3.js";
import { Coder, rustString } from "coders";
import { IInstrctionDataField } from "types/internal";

export class BufferLayoutCoder implements Coder {
  encode(fields: IInstrctionDataField[]): Buffer {
    // TODO non-unique name is used for layout names - makes errors more user-friendly than id
    const layout = BufferLayout.struct<any>(fields.map(mapToLayout));

    const values = fields.reduce((acc, { name, type, value }) => {
      let encoded = value;

      if (type === "publicKey") {
        encoded = new PublicKey(encoded).toBuffer();
      }

      acc[name!] = encoded;
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
}: IInstrctionDataField): BufferLayout.Layout<any> => {
  switch (type) {
    case "u8":
      return BufferLayout.u8(name);
    case "i8":
      return BufferLayout.s8(name);
    case "u16":
      return BufferLayout.u16(name);
    case "i16":
      return BufferLayout.s16(name);
    case "u32":
      return BufferLayout.u32(name);
    case "i32":
      return BufferLayout.s32(name);
    case "u64":
      return BufferLayout.nu64(name);
    case "i64":
      return BufferLayout.ns64(name);
    case "bool":
      return BufferLayout.u8(name);
    case "publicKey":
      return BufferLayout.blob(32, name);
    case "string":
      return rustString(name);
  }

  throw new Error(`Cannot determine layout for: ${name} with type ${type}`);
};
