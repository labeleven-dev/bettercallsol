import { v4 as uuid } from "uuid";
import { IInstrctionDataFieldExt, ITransactionExt } from "./external-types";
import { IInstrctionDataField, ITransaction } from "./internal-types";
import {
  Identifiable,
  SortableCollection,
  toSortableCollection,
  toSortedArray,
} from "./sortable";

const mapToIInstrctionDataFieldExt = ({
  name,
  type,
  value,
}: IInstrctionDataField): IInstrctionDataFieldExt => ({
  name,
  type,
  value,
});

export const mapToTransactionExt = ({
  name,
  instructions,
}: ITransaction): ITransactionExt => ({
  name,
  instructions: toSortedArray(instructions).map(
    ({ name, programId, accounts, data }) => ({
      name,
      programId,
      accounts: toSortedArray(accounts).map(
        ({ name, pubkey, isWritable, isSigner }) => ({
          name,
          pubkey,
          isWritable,
          isSigner,
        })
      ),
      data: {
        format: data.format,
        value:
          data.format === "borsh"
            ? toSortedArray(data.borsh).map(mapToIInstrctionDataFieldExt)
            : data.format === "bufferLayout"
            ? toSortedArray(data.bufferLayout).map(mapToIInstrctionDataFieldExt)
            : data.raw,
      },
    })
  ),
});

const mapToSortableCollection = <T>(
  items: T[]
): SortableCollection<T & Identifiable> =>
  toSortableCollection(items.map((item) => ({ ...item, id: uuid() })));

export const mapFromTransactionExt = ({
  name,
  instructions,
}: ITransactionExt): ITransaction => ({
  name,
  instructions: mapToSortableCollection(
    instructions.map(({ name, programId, accounts, data }) => ({
      name,
      programId,
      accounts: mapToSortableCollection(
        accounts.map(({ name, pubkey, isWritable, isSigner }) => ({
          name,
          pubkey,
          isWritable,
          isSigner,
        }))
      ),
      data: {
        format: data.format,
        raw: data.format === "raw" ? (data.value as string) : "",
        borsh: mapToSortableCollection(
          data.format === "borsh"
            ? (data.value as IInstrctionDataFieldExt[])
            : []
        ),
        bufferLayout: mapToSortableCollection(
          data.format === "bufferLayout"
            ? (data.value as IInstrctionDataFieldExt[])
            : []
        ),
      },
      disabled: false,
      expanded: true,
    }))
  ),
});

// const mapFromTransactionExport = (
//   transaction: ITransactionExport
// ): ITransaction => {
// };

// export const serialiseTransaction = (transaction: ITransaction): string => {};

// export const deserialiseTransaction = (serialised: string): ITransaction => {};
