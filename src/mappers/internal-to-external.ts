import {
  IAccountExt,
  IInstrctionDataFieldExt,
  ITransactionExt,
} from "../types/external";
import {
  IAccount,
  IInstrctionDataField,
  ITransaction,
} from "../types/internal";
import { toSortedArray } from "../utils/sortable";

const mapIAccountToIAccountExt = ({
  type,
  name,
  pubkey,
  isWritable,
  isSigner,
}: IAccount): IAccountExt => ({
  type,
  name: name || undefined,
  pubkey,
  isWritable,
  isSigner,
});

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
    ({
      name,
      programId,
      programMetadata,
      accounts,
      data,
      anchorMethod,
      anchorAccounts,
    }) => ({
      name: name || undefined,
      programId,
      programMetadata,
      accounts: toSortedArray(accounts).map(mapIAccountToIAccountExt),
      data: {
        format: data.format,
        value:
          data.format === "borsh"
            ? toSortedArray(data.borsh).map(mapToIInstrctionDataFieldExt)
            : data.format === "bufferLayout"
            ? toSortedArray(data.bufferLayout).map(mapToIInstrctionDataFieldExt)
            : data.raw,
      },
      anchorMethod,
      anchorAccounts: anchorAccounts?.map(mapIAccountToIAccountExt),
    })
  ),
});
