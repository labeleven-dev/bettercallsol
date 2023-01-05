import { AddIcon } from "@chakra-ui/icons";
import {
  Flex,
  Grid,
  Icon,
  IconButton,
  Spacer,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { CopyButton } from "components/common/CopyButton";
import { Numbering } from "components/common/Numbering";
import { DataPreview } from "components/palette/preview/DataPreview";
import { InstructionAccountSummary } from "components/palette/preview/InstructionAccountSummary";
import { useSessionStoreWithUndo } from "hooks/useSessionStore";
import { mapIInstructionPreviewToIInstruction } from "mappers/preview-to-internal";
import { IInstructionPreview, PreviewSource } from "types/preview";
import { addTo } from "utils/sortable";
import { short } from "utils/web3js";

export const InstructionPreview: React.FC<{
  index: number;
  instruction: IInstructionPreview;
  source: PreviewSource;
  interactive?: boolean;
}> = ({ instruction, source, index, interactive = true }) => {
  const set = useSessionStoreWithUndo((state) => state.set);

  const { name, programId, accountSummary, data, innerInstructions } =
    instruction;

  const isSource = (...sources: PreviewSource[]) => sources.includes(source);

  return (
    <Grid
      mb="2"
      p="2"
      pt="3"
      border="1px"
      rounded="md"
      borderColor={useColorModeValue("gray.300", "gray.600")}
    >
      <Flex mb="1" alignItems="center">
        {/* TODO implement drag-and-drop */}
        {/* <DragHandle unlockedProps={{ h: "2.5", mr: "1" }} /> */}

        <InstructionIcon />

        <Numbering index={index} ml="2" minW="25px" />

        <Text ml="2" fontSize="sm">
          {name || `Instruction #${index + 1}`}
        </Text>

        <Spacer />

        {interactive && (
          <Tooltip label="Add to transaction">
            <IconButton
              mt="-1"
              size="xs"
              variant="ghost"
              aria-label="Add to transaction"
              icon={<AddIcon />}
              onClick={() => {
                set((state) => {
                  addTo(
                    state.transaction.instructions,
                    mapIInstructionPreviewToIInstruction(instruction, source)
                  );
                });
              }}
            />
          </Tooltip>
        )}
      </Flex>

      {isSource("tx", "shareUrl", "shareJson") && programId && (
        <Flex ml="5" mt="1" alignItems="center">
          <Flex>
            <ProgramIcon />
            <Tooltip label={programId}>
              <Text ml="2" fontSize="sm" as="kbd">
                {short(programId)}
              </Text>
            </Tooltip>
          </Flex>
          <CopyButton size="xs" value={programId} />
        </Flex>
      )}

      <InstructionAccountSummary ml="5" summary={accountSummary} />
      {data && <DataPreview ml="5" mt="1" data={data} />}

      {(innerInstructions?.length || 0) > 0 && (
        <Flex ml="5" mt="1" alignItems="center">
          <Tooltip label="Inner instructions">
            <Flex>
              <InstructionIcon />
              <Text ml="2" fontSize="sm">
                {innerInstructions?.length}
              </Text>
            </Flex>
          </Tooltip>
        </Flex>
      )}
    </Grid>
  );
};

const ProgramIcon: React.FC = () => (
  <Icon
    viewBox="0 0 64 64"
    color={useColorModeValue("purple.400", "purple.200")}
  >
    <path
      d="M33.543 22.531h-5.464v8.543h5.464c1.384 0 2.46-.348 3.228-1.043s1.151-1.797 1.151-3.307s-.384-2.586-1.151-3.229s-1.844-.964-3.228-.964"
      fill="currentColor"
    ></path>
    <path
      d="M31.999 2c-16.568 0-30 13.432-30 30s13.432 30 30 30C48.568 62 62 48.568 62 32S48.568 2 31.999 2m9.398 31.949c-1.699 1.418-4.125 2.125-7.277 2.125h-6.041v10.434h-6.023V17.492h12.458c2.872 0 5.162.748 6.87 2.244c1.707 1.496 2.562 3.813 2.562 6.949c-.001 3.424-.85 5.846-2.549 7.264"
      fill="currentColor"
    ></path>
  </Icon>
);

const InstructionIcon: React.FC = () => (
  <Icon
    viewBox="0 0 64 64"
    color={useColorModeValue("orange.400", "orange.200")}
  >
    <path
      d="M32 2C15.432 2 2 15.431 2 32c0 16.569 13.432 30 30 30s30-13.432 30-30C62 15.431 48.568 2 32 2m3.012 44.508h-6.023V17.492h6.023v29.016"
      fill="currentColor"
    ></path>
  </Icon>
);
