import { Idl } from "@project-serum/anchor";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { BorshCoder } from "coders/borsh";
import { mapIdlInstructionToIInstructionPreview } from "mappers/idl-to-preview";
import { mapIInstructionPreviewToIInstruction } from "mappers/preview-to-internal";
import { IInstruction, IInstructionData } from "types/internal";
import { newDataField } from "utils/internal";
import {
  appendTo,
  prependTo,
  toSortableCollection,
  toSortedArray,
} from "utils/sortable";
import { anchorMethodSighash } from "utils/web3js";

export const ejectFromAnchor = (instruction: IInstruction): IInstruction => {
  const { accounts, anchorAccounts, anchorMethod, data } = instruction;

  const anchorAccountsCollection = toSortableCollection(anchorAccounts || []);

  prependTo(data.borsh, {
    ...newDataField(),
    name: "sighash",
    type: "bytes",
    value: bs58.encode(anchorMethodSighash(anchorMethod!)), // definitely an Anchor method here
  });

  return {
    ...instruction,
    anchorMethod: undefined,
    anchorAccounts: [],
    accounts: {
      map: { ...anchorAccountsCollection.map, ...accounts.map },
      order: anchorAccountsCollection.order.concat(accounts.order),
    },
  };
};

export const detectAnchorMethod = (
  data: IInstructionData,
  idl: Idl
): string | null => {
  let sighash: string | null = null;
  if (data.format === "raw") {
    const buffer =
      data.raw.encoding === "hex"
        ? Buffer.from(data.raw.content, "hex")
        : data.raw.encoding === "bs58"
        ? bs58.decode(data.raw.content)
        : Buffer.from(data.raw.encoding, "utf-8");
    sighash = bs58.encode(buffer.slice(0, 8));
  } else if (data.format === "borsh") {
    const field = data.borsh.map[data.borsh.order[0]];
    if (field.type === "bytes") {
      sighash = field.value;
    }
  }

  if (!sighash) return null;

  return (
    idl.instructions.find(
      ({ name }) => bs58.encode(anchorMethodSighash(name)) === sighash
    )?.name ?? null
  );
};

export const tryMapToAnchor = (
  { programId, accounts, data }: IInstruction,
  instructionName: string,
  idl: Idl
): IInstruction => {
  if (data.format === "bufferLayout") {
    throw new Error(
      "Buffer Layout is not a supported data format for Anchor instructions."
    );
  }

  const idlInstruction = idl.instructions.find(
    ({ name }) => name === instructionName
  )!;
  const newInstruction = mapIInstructionPreviewToIInstruction(
    mapIdlInstructionToIInstructionPreview(idlInstruction, programId),
    "anchorProgramId"
  );

  // fill in accounts
  toSortedArray(accounts).forEach((account, index) => {
    if (index < (newInstruction.anchorAccounts?.length ?? 0)) {
      newInstruction.anchorAccounts![index].pubkey = account.pubkey;
    } else {
      appendTo(newInstruction.accounts, account);
    }
  });

  // parse data
  if (data.format === "raw") {
    const fields = new BorshCoder().decodeFromRaw(
      data.raw,
      toSortedArray(newInstruction.data.borsh)
    );

    const fieldMapping = Object.entries(newInstruction.data.borsh.map).reduce(
      (acc, [id, { name }]) => {
        acc[name!] = id; // every field will have a name
        return acc;
      },
      {} as Record<string, string>
    );

    Object.entries(fields).forEach(([name, value]) => {
      newInstruction.data.borsh.map[fieldMapping[name]].value = value;
    });
  } else {
    toSortedArray(data.borsh)
      .slice(1) // drop the sighash field
      .forEach(({ type, value }, index) => {
        const anchorField =
          newInstruction.data.borsh.map[newInstruction.data.borsh.order[index]];
        if (type !== anchorField.type) {
          throw new Error(
            `Mismatch type for instruction data ${anchorField.name} (${index}): ${type} vs ${anchorField.type}`
          );
        }
        anchorField.value = value;
      });
  }

  return newInstruction;
};
