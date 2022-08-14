import { IInstruction, ITransaction } from "../types/internal";
import { IInstructionPreview, IPreview, PreviewSource } from "../types/preview";
import { toSortableCollection, toSortedArray } from "../utils/sortable";
import { mapIInstructionExtToIInstruction } from "./external-to-internal";

export const mapIInstructionPreviewToIInstruction = (
  instruction: IInstructionPreview,
  source: PreviewSource
): IInstruction => {
  const mapped = mapIInstructionExtToIInstruction(instruction);

  // preview doesn't have anchorMethod or anchorAccounts
  // those values are overloaded into name and accounts for anchor instructions
  if (source === "anchorProgramId") {
    mapped.anchorMethod = mapped.name;
    mapped.anchorAccounts = toSortedArray(mapped.accounts);
    mapped.accounts = toSortableCollection([]);
  }

  return mapped;
};

export const mapIPreviewToITransaction = ({
  source,
  name,
  instructions,
}: IPreview): ITransaction => ({
  name,
  instructions: toSortableCollection(
    instructions.map((instruction) =>
      mapIInstructionPreviewToIInstruction(instruction, source)
    )
  ),
});
