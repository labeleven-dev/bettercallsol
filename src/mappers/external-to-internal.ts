import {
  IAccountExt,
  IInstrctionDataFieldExt,
  IInstructionExt,
  ITransactionExt,
} from "types/external";
import {
  IAccount,
  IInstruction,
  IInstructionDataRaw,
  ITransaction,
} from "types/internal";
import { Identifiable, SortableCollection } from "types/sortable";
import { toSortableCollection } from "utils/sortable";
import { toTransactionVersion } from "utils/web3js";
import { v4 as uuid } from "uuid";

const mapToSortable = <T>(item: T): T & Identifiable => ({
  ...item,
  id: uuid(),
});

const mapToSortableCollection = <T>(
  items: T[]
): SortableCollection<T & Identifiable> =>
  toSortableCollection(items.map(mapToSortable));

const mpaIAccountExtToIAccount = ({
  name,
  description,
  type,
  pubkey,
  isWritable,
  isSigner,
}: IAccountExt): IAccount => ({
  id: uuid(),
  description,
  type,
  name,
  pubkey: pubkey || "",
  isWritable,
  isSigner,
});

export const mapIInstructionExtToIInstruction = ({
  name,
  description,
  programId,
  programMetadata,
  accounts,
  data,
  anchorMethod,
  anchorAccounts,
}: IInstructionExt): IInstruction =>
  mapToSortable({
    name,
    description,
    programId,
    programMetadata,
    accounts: mapToSortableCollection(accounts.map(mpaIAccountExtToIAccount)),
    data: {
      format: data.format,
      raw:
        data.format === "raw"
          ? (data.value as IInstructionDataRaw)
          : {
              content: "",
              encoding: "bs58",
            },
      borsh: mapToSortableCollection(
        data.format === "borsh"
          ? (data.value as IInstrctionDataFieldExt[]).map((v) => ({
              id: uuid(),
              ...v,
            }))
          : []
      ),
      bufferLayout: mapToSortableCollection(
        data.format === "bufferLayout"
          ? (data.value as IInstrctionDataFieldExt[]).map((v) => ({
              id: uuid(),
              ...v,
            }))
          : []
      ),
    },
    anchorMethod,
    anchorAccounts: anchorAccounts?.map(mpaIAccountExtToIAccount),
    disabled: false,
    expanded: true,
  });

// TODO fail if not versionCompatible
export const mapITransactionExtToITransaction = ({
  name,
  txnVersion,
  description,
  instructions,
}: ITransactionExt): ITransaction => ({
  name,
  version: toTransactionVersion(txnVersion),
  description,
  instructions: mapToSortableCollection(
    instructions.map(mapIInstructionExtToIInstruction)
  ),
});
