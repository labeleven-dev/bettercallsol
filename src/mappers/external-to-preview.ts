import { accountSummary } from "mappers/web3js-to-preview";
import { ITransactionExt } from "types/external";
import { IPreview, PreviewSource } from "types/preview";

export const mapITransactionExtToIPreview = (
  { name, instructions }: ITransactionExt,
  source: PreviewSource,
  sourceValue: string
): IPreview => {
  return {
    source,
    sourceValue,
    name,
    instructions: instructions.map((instruction) => ({
      ...instruction,
      accountSummary: accountSummary(instruction.accounts),
    })),
  };
};
