import { bettercallsol as protobuf, google } from "generated/protobuf";
import {
  mapAccountTypeToProtobuf,
  mapDataFormatToProtobuf,
  mapINetworkToProtobuf,
  mapInstructionDataFieldTypeToProtobuf,
  mapRawEncodingToProtobuf,
} from "mappers/protobuf";
import pako from "pako";
import {
  IAccountExt,
  IInstrctionDataFieldExt,
  ITransactionExt,
} from "types/external";
import { IAccountMetadata, IInstructionDataRaw } from "types/internal";

const mapAnyToProtobuf = (x: any): google.protobuf.IValue =>
  typeof x === "boolean"
    ? { boolValue: x }
    : typeof x === "number"
    ? { numberValue: x }
    : { stringValue: x };

const mapIAccountMetadataToProtobuf = ({
  name,
  mint,
  seeds,
  bump,
}: IAccountMetadata): protobuf.Transaction.Instruction.IAccountMetadata => ({
  name,
  mint,
  seeds: seeds?.map(mapAnyToProtobuf),
  bump,
});

const mapIAccountExtToProtobuf = ({
  type,
  name,
  description,
  pubkey,
  isSigner,
  isWritable,
  metadata,
}: IAccountExt): protobuf.Transaction.Instruction.IAccount => ({
  type: mapAccountTypeToProtobuf[type],
  name,
  description,
  pubkey,
  isSigner,
  isWritable,
  metadata: metadata ? mapIAccountMetadataToProtobuf(metadata) : undefined,
});

const mapIInstructionDataRawToProtobuf = ({
  content,
  encoding,
  description,
}: IInstructionDataRaw): protobuf.Transaction.Instruction.Data.IDataRaw => ({
  content,
  encoding: mapRawEncodingToProtobuf[encoding],
  description,
});

const mapIInstrctionDataFieldExtToProtobuf = ({
  name,
  description,
  type,
  value,
}: IInstrctionDataFieldExt): protobuf.Transaction.Instruction.Data.IDataField => ({
  name,
  description,
  type: mapInstructionDataFieldTypeToProtobuf[type],
  value: mapAnyToProtobuf(value),
});

const encodeBase64Url = (byteArray: Uint8Array): string =>
  btoa(
    Array.from(byteArray)
      .map((val) => {
        return String.fromCharCode(val);
      })
      .join("")
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

export const mapITransactionExtToProtobuf = ({
  version,
  txnVersion,
  network,
  name,
  description,
  instructions,
}: ITransactionExt): string => {
  const transaction: protobuf.ITransaction = {
    version,
    txnVersion,
    network: mapINetworkToProtobuf[network],
    name,
    description,
    instructions: instructions.map(
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
        name,
        description,
        programId,
        programMetadata: programMetadata
          ? mapIAccountMetadataToProtobuf(programMetadata)
          : undefined,
        accounts: accounts.map(mapIAccountExtToProtobuf),
        data: {
          format: mapDataFormatToProtobuf[data.format],
          // slightly different structure due to protobuf limitations
          rawValue:
            data.format === "raw"
              ? mapIInstructionDataRawToProtobuf(
                  data.value as IInstructionDataRaw
                )
              : undefined,
          fieldValue:
            data.format !== "raw"
              ? (data.value as IInstrctionDataFieldExt[]).map(
                  mapIInstrctionDataFieldExtToProtobuf
                )
              : undefined,
        },
        anchorMethod,
        anchorAccounts: anchorAccounts?.map(mapIAccountExtToProtobuf),
      })
    ),
  };

  const message = protobuf.Transaction.create(transaction);
  const buffer = protobuf.Transaction.encode(message).finish();
  return encodeBase64Url(pako.deflate(buffer));
};
