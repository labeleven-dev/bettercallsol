import {
  IAccountExt,
  IInstrctionDataFieldExt,
  ITransactionExt,
} from "../types/external";
import {
  IAccount,
  IInstrctionDataField,
  IRpcEndpoint,
  ITransaction,
} from "../types/internal";
import { toSortedArray } from "../utils/sortable";

const mapIAccountToIAccountExt = ({
  type,
  name,
  description,
  pubkey,
  isWritable,
  isSigner,
}: IAccount): IAccountExt => ({
  type,
  name: name,
  description,
  pubkey,
  isWritable,
  isSigner,
});

const mapToIInstrctionDataFieldExt = ({
  name,
  description,
  type,
  value,
}: IInstrctionDataField): IInstrctionDataFieldExt => ({
  name,
  description,
  type,
  value,
});

export const mapITransactionToTransactionExt = (
  { name, description, instructions }: ITransaction,
  rpcEndpoint: IRpcEndpoint
): ITransactionExt => ({
  version: "1.0.0",
  network: rpcEndpoint.network,
  name,
  description,
  instructions: toSortedArray(instructions).map(
    ({
      name,
      description,
      programId,
      programMetadata,
      accounts,
      data,
      anchorMethod,
      anchorAccounts,
    }) => ({
      name: name || undefined,
      description,
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
