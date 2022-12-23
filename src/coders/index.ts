import * as BufferLayout from "@solana/buffer-layout";
import { IInstrctionDataField } from "types/internal";

export interface Coder {
  encode(fields: IInstrctionDataField[]): Buffer;
  // decode(
  //   buffer: Buffer | string,
  //   encoding: "hex" | "base58"
  // ): IInstrctionDataField[];
}

/**
 * Layout for a Rust String type
 *
 * From https://github.com/solana-labs/solana-program-library/blob/master/token-swap/js/src/layout.ts
 */
export const rustString = (
  property: string = "string"
): BufferLayout.Structure<any> => {
  const rsl = BufferLayout.struct<any>(
    [
      BufferLayout.u32("length"),
      BufferLayout.u32("lengthPadding"),
      BufferLayout.blob(BufferLayout.offset(BufferLayout.u32(), -8), "chars"),
    ],
    property
  );
  const _decode = rsl.decode.bind(rsl);
  const _encode = rsl.encode.bind(rsl);

  rsl.decode = (buffer: Buffer, offset: number) => {
    const data = _decode(buffer, offset);
    return data.chars.toString("utf8");
  };

  rsl.encode = (str: string, buffer: Buffer, offset: number) => {
    const data = {
      chars: Buffer.from(str, "utf8"),
    };
    return _encode(data, buffer, offset);
  };

  return rsl;
};
