import { Idl } from "@project-serum/anchor";
import {
  IdlAccount,
  IdlAccountItem,
  IdlInstruction,
} from "@project-serum/anchor/dist/cjs/idl";
import { accountSummary } from "mappers/web3js-to-preview";
import { IAccountExt, IInstrctionDataFieldExt } from "types/external";
import { IPubKey, IRpcEndpoint } from "types/internal";
import { IInstructionPreview, IPreview, PreviewSource } from "types/preview";

const mapIdlAccountItemToIAccountExt = (
  account: IdlAccountItem
): IAccountExt | null => {
  if (Object.keys(account).includes("isMut")) {
    const { name, isMut, isSigner } = account as IdlAccount;
    // TODO account resolver for common stuff
    return {
      type: "unspecified",
      name,
      pubkey: "",
      isWritable: isMut,
      isSigner,
    };
  } else {
    return null; // TODO support nested accounts
  }
};

const mapIdlInstructionToIInstructionPreview = (
  { name, accounts, args }: IdlInstruction,
  programId: IPubKey
): IInstructionPreview => {
  const mappedAccounts = accounts
    .map(mapIdlAccountItemToIAccountExt)
    .filter((x) => x !== null) as IAccountExt[];

  return {
    name,
    programId,
    accounts: mappedAccounts,
    accountSummary: accountSummary(mappedAccounts),
    data: {
      format: "borsh",
      value: args.map(
        ({ name, type }) =>
          ({
            name,
            type: typeof type === "string" ? type : "unsupported", // TODO support defined, option, etc.
          } as IInstrctionDataFieldExt)
      ),
    },
  };
};

export const mapIdlToIPreview = (
  { name, instructions }: Idl,
  source: PreviewSource,
  programId: IPubKey,
  rpcEndpoint?: IRpcEndpoint
): IPreview => ({
  source,
  sourceValue: programId,
  version: 0,
  rpcEndpoint,
  name,
  instructions: instructions.map((instruction) =>
    mapIdlInstructionToIInstructionPreview(instruction, programId)
  ),
  addressLookupTables: [],
});
