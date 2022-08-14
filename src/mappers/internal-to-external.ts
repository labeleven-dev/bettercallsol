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
  name,
  pubkey,
  isWritable,
  isSigner,
}: IAccount): IAccountExt => ({
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
    ({ name, programId, accounts, data, anchorMethod, anchorAccounts }) => ({
      name: name || undefined,
      programId,
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
