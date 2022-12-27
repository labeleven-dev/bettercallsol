import { bettercallsol as protobuf, google } from "generated/protobuf";
import {
  mapProtobuffToDataFormat,
  mapProtobufToAccountType,
  mapProtobufToINetwork,
  mapProtobufToInstructionDataFieldType,
  mapProtobufToRawEncoding,
} from "mappers/protobuf";
import pako from "pako";
import {
  IAccountExt,
  IInstrctionDataFieldExt,
  ITransactionExt,
} from "types/external";
import { IAccountMetadata, IInstructionDataRaw } from "types/internal";

const mapValueToAny = ({
  boolValue,
  numberValue,
  stringValue,
}: google.protobuf.IValue): any =>
  boolValue !== undefined && boolValue !== null
    ? boolValue
    : numberValue !== undefined && numberValue !== null
    ? numberValue
    : stringValue;

const mapProtobufToIAccountMetadata = ({
  name,
  mint,
  seeds,
  bump,
}: protobuf.Transaction.Instruction.IAccountMetadata): IAccountMetadata => ({
  name: name ?? undefined,
  mint: mint ?? undefined,
  seeds: seeds?.map(mapValueToAny),
  bump: bump ?? undefined,
});

const mapProtobufToIAccountExt = ({
  type,
  name,
  description,
  pubkey,
  isSigner,
  isWritable,
  metadata,
}: protobuf.Transaction.Instruction.IAccount): IAccountExt => ({
  type: mapProtobufToAccountType[type!],
  name: name ?? undefined,
  description: description ?? undefined,
  pubkey: pubkey!,
  isSigner: isSigner!,
  isWritable: isWritable!,
  metadata: metadata ? mapProtobufToIAccountMetadata(metadata) : undefined,
});

const mapProtobufToIInstructionDataRaw = ({
  content,
  encoding,
  description,
}: protobuf.Transaction.Instruction.Data.IDataRaw): IInstructionDataRaw => ({
  content: content!,
  encoding: mapProtobufToRawEncoding[encoding!],
  description: description ?? undefined,
});

const mapProtobufToIInstrctionDataFieldExt = ({
  name,
  description,
  type,
  value,
}: protobuf.Transaction.Instruction.Data.IDataField): IInstrctionDataFieldExt => ({
  name: name ?? undefined,
  description: description ?? undefined,
  type: mapProtobufToInstructionDataFieldType[type!],
  value: value ? mapValueToAny(value) : undefined,
});

const decodeBase64Url = (base64: string): Uint8Array =>
  new Uint8Array(
    atob(base64.replace(/-/g, "+").replace(/_/g, "/"))
      .split("")
      .map((val) => {
        return val.charCodeAt(0);
      })
  );

export const mapProtobufToITransactionExt = (
  encoded: string
): ITransactionExt => {
  const buffer = pako.inflate(decodeBase64Url(encoded));
  const decoded = protobuf.Transaction.decode(buffer);

  const { version, txnVersion, network, name, description, instructions } =
    decoded;

  return {
    version,
    txnVersion,
    network: mapProtobufToINetwork[network],
    name: name || undefined,
    description: description || undefined,
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
        name: name ?? undefined,
        description: description ?? undefined,
        programId: programId!,
        programMetadata: programMetadata
          ? mapProtobufToIAccountMetadata(programMetadata)
          : undefined,
        accounts: accounts!.map(mapProtobufToIAccountExt),
        data: {
          format: mapProtobuffToDataFormat[data?.format!],
          // slightly different structure due to protobuf limitations
          value:
            data!.format ===
            protobuf.Transaction.Instruction.Data.DataFormat.RAW
              ? mapProtobufToIInstructionDataRaw(data?.rawValue!)
              : data!.fieldValue!.map(mapProtobufToIInstrctionDataFieldExt),
        },
        anchorMethod: anchorMethod ?? undefined,
        anchorAccounts: anchorAccounts?.map(mapProtobufToIAccountExt),
      })
    ),
  };
};
