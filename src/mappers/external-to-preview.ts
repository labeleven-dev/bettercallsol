import { accountSummary } from "mappers/web3js-to-preview";
import { ITransactionExt } from "types/external";
import { IPreview, PreviewSource } from "types/preview";
import { toTransactionVersion } from "utils/web3js";

export const mapITransactionExtToIPreview = (
  { txnVersion, name, instructions }: ITransactionExt,
  source: PreviewSource,
  sourceValue: string
): IPreview => {
  return {
    source,
    sourceValue,
    version: toTransactionVersion(txnVersion),
    name,
    instructions: instructions.map((instruction) => ({
      ...instruction,
      accountSummary: accountSummary(instruction.accounts),
    })),
  };
};
