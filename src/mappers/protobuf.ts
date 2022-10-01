import { bettercallsol as protobuf } from "../generated/protobuf";
import {
  AccountType,
  DataFormat,
  INetwork,
  InstructionDataFieldType,
  RawEncoding,
} from "../types/internal";

// enums
const ProtoNetwork = protobuf.Transaction.Network;
const ProtoAccountType = protobuf.Transaction.Instruction.Account.AccountType;
const ProtoDataFormat = protobuf.Transaction.Instruction.Data.DataFormat;
const ProtoRawEncoding = protobuf.Transaction.Instruction.Data.DataRaw.Encoding;
const ProtoDataFieldType =
  protobuf.Transaction.Instruction.Data.DataField.DataFieldType;

/** Reversed a map, swapping keys and values */
const reverse = <
  K extends string | number | symbol,
  V extends string | number | symbol
>(
  map: Record<K, V>
): Record<V, K> =>
  Object.entries(map).reduce((acc, [k, v]) => {
    acc[v as V] = k as K;
    return acc;
  }, {} as Record<V, K>);

export const mapINetworkToProtobuf: Record<
  INetwork,
  protobuf.Transaction.Network
> = {
  "mainnet-beta": ProtoNetwork.MAINNET_BETA,
  testnet: ProtoNetwork.TESTNET,
  devnet: ProtoNetwork.DEVNET,
  custom: ProtoNetwork.CUSTOM,
};
export const mapProtobufToINetwork: Record<
  protobuf.Transaction.Network,
  INetwork
> = reverse(mapINetworkToProtobuf);

export const mapAccountTypeToProtobuf: Record<
  AccountType,
  protobuf.Transaction.Instruction.Account.AccountType
> = {
  unspecified: ProtoAccountType.UNSPECIFIED,
  wallet: ProtoAccountType.WALLET,
  keypair: ProtoAccountType.KEYPAIR,
  program: ProtoAccountType.PROGRAM,
  sysvar: ProtoAccountType.SYSVAR,
  pda: ProtoAccountType.PDA,
  ata: ProtoAccountType.ATA,
};
export const mapProtobufToAccountType: Record<
  protobuf.Transaction.Instruction.Account.AccountType,
  AccountType
> = reverse(mapAccountTypeToProtobuf);

export const mapDataFormatToProtobuf: Record<
  DataFormat,
  protobuf.Transaction.Instruction.Data.DataFormat
> = {
  raw: ProtoDataFormat.RAW,
  bufferLayout: ProtoDataFormat.BUFFER_LAYOUT,
  borsh: ProtoDataFormat.BORSH,
};
export const mapProtobuffToDataFormat: Record<
  protobuf.Transaction.Instruction.Data.DataFormat,
  DataFormat
> = reverse(mapDataFormatToProtobuf);

export const mapRawEncodingToProtobuf: Record<
  RawEncoding,
  protobuf.Transaction.Instruction.Data.DataRaw.Encoding
> = {
  hex: ProtoRawEncoding.HEX,
  bs58: ProtoRawEncoding.BS58,
};
export const mapProtobufToRawEncoding: Record<
  protobuf.Transaction.Instruction.Data.DataRaw.Encoding,
  RawEncoding
> = reverse(mapRawEncodingToProtobuf);

export const mapInstructionDataFieldTypeToProtobuf: Record<
  InstructionDataFieldType,
  protobuf.Transaction.Instruction.Data.DataField.DataFieldType
> = {
  unsupported: ProtoDataFieldType.UNSUPPORTED,
  u8: ProtoDataFieldType.U8,
  i8: ProtoDataFieldType.I8,
  u16: ProtoDataFieldType.U16,
  i16: ProtoDataFieldType.I16,
  u32: ProtoDataFieldType.U32,
  i32: ProtoDataFieldType.I32,
  f32: ProtoDataFieldType.F32,
  u64: ProtoDataFieldType.U64,
  i64: ProtoDataFieldType.I64,
  f64: ProtoDataFieldType.F64,
  u128: ProtoDataFieldType.U128,
  i128: ProtoDataFieldType.I128,
  bool: ProtoDataFieldType.BOOL,
  bytes: ProtoDataFieldType.BYTES,
  publicKey: ProtoDataFieldType.PUBLIC_KEY,
  string: ProtoDataFieldType.STRING,
};
export const mapProtobufToInstructionDataFieldType: Record<
  protobuf.Transaction.Instruction.Data.DataField.DataFieldType,
  InstructionDataFieldType
> = reverse(mapInstructionDataFieldTypeToProtobuf);
