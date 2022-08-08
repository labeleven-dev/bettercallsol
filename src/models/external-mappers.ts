import { v4 as uuid } from "uuid";
import {
  IInstrctionDataFieldExt,
  IInstructionExt,
  ITransactionExt,
} from "./external-types";
import {
  IInstrctionDataField,
  IInstruction,
  ITransaction,
} from "./internal-types";
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

export const mapITransactionToTransactionExt = ({
  name,
  instructions,
}: ITransaction): ITransactionExt => ({
  name,
  instructions: toSortedArray(instructions).map(
    ({ name, dynamic, programId, accounts, data }) => ({
      name: name || undefined,
      dynamic,
      programId,
      accounts: toSortedArray(accounts).map(
        ({ name, pubkey, isWritable, isSigner }) => ({
          name: name || undefined,
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

const mapToSortable = <T>(item: T): T & Identifiable => ({
  ...item,
  id: uuid(),
});

const mapToSortableCollection = <T>(
  items: T[]
): SortableCollection<T & Identifiable> =>
  toSortableCollection(items.map(mapToSortable));

export const mapITransactionExtToITransaction = ({
  name,
  instructions,
}: ITransactionExt): ITransaction => ({
  name,
  instructions: mapToSortableCollection(
    instructions.map(mapIInstructionExtToIInstruction)
  ),
});

export const mapIInstructionExtToIInstruction = ({
  name,
  dynamic,
  programId,
  accounts,
  data,
}: IInstructionExt): IInstruction =>
  mapToSortable({
    name,
    dynamic,
    programId,
    accounts: mapToSortableCollection(
      accounts.map(({ name, pubkey, isWritable, isSigner }) => ({
        name,
        pubkey: pubkey || "",
        isWritable,
        isSigner,
      }))
    ),
    data: {
      format: data.format,
      raw: data.format === "raw" ? (data.value as string) : "",
      borsh: mapToSortableCollection(
        data.format === "borsh"
          ? (data.value as IInstrctionDataFieldExt[]).map((v) => ({
              value: "",
              ...v,
            }))
          : []
      ),
      bufferLayout: mapToSortableCollection(
        data.format === "bufferLayout"
          ? (data.value as IInstrctionDataFieldExt[]).map((v) => ({
              value: "",
              ...v,
            }))
          : []
      ),
    },
    disabled: false,
    expanded: true,
  });

// const mapFromTransactionExport = (
//   transaction: ITransactionExport
// ): ITransaction => {
// };

// export const serialiseTransaction = (transaction: ITransaction): string => {};

// export const deserialiseTransaction = (serialised: string): ITransaction => {};
