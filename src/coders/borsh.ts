import { IdlCoder } from "@project-serum/anchor/dist/cjs/coder/borsh/idl";
import { IdlType } from "@project-serum/anchor/dist/cjs/idl";
import * as Borsh from "@project-serum/borsh";
import { Coder } from ".";
import { IInstrctionDataField } from "../models/internal-types";

export class BorshCoder implements Coder {
  encode(fields: IInstrctionDataField[]): Buffer {
    const layout = Borsh.struct(
      fields.map(({ name, type }) =>
        IdlCoder.fieldLayout({ name, type: type as IdlType })
      )
    );
    const values = fields.reduce((acc, { name, value }) => {
      acc[name!] = value;
      return acc;
    }, {} as Record<string, any>);

    const buffer = Buffer.alloc(layout.span);
    layout.encode(values, buffer);
    return buffer;
  }
}
