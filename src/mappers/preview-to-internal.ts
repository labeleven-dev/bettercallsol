import { mapIInstructionExtToIInstruction } from "mappers/external-to-internal";
import { IInstruction, ITransaction } from "types/internal";
import { IInstructionPreview, IPreview, PreviewSource } from "types/preview";
import { toSortableCollection, toSortedArray } from "utils/sortable";

export const mapIInstructionPreviewToIInstruction = (
  instruction: IInstructionPreview,
  source: PreviewSource
): IInstruction => {
  // preview is just a subset of external
  const mapped = mapIInstructionExtToIInstruction(instruction);

  // preview doesn't have anchorMethod or anchorAccounts
  // those values are overloaded into name and accounts for anchor instructions
  if (source === "anchorProgramId" || source === "anchorJson") {
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
