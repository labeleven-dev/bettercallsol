import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Grid,
  Icon,
  IconButton,
  Spacer,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSessionStoreWithUndo } from "../../../hooks/useSessionStore";
import { mapToIInstruction } from "../../../models/preview-mappers";
import { IInstructionPreview } from "../../../models/preview-types";
import { addTo } from "../../../models/sortable";
import { short } from "../../../models/web3js-mappers";
import { CopyButton } from "../../common/CopyButton";
import { AccountSummary } from "./AccountSummary";

export const InstructionPreview: React.FC<{
  index: number;
  instruction: IInstructionPreview;
}> = ({ instruction, index }) => {
  const set = useSessionStoreWithUndo((state) => state.set);

  const { programId, accountSummary, innerInstructions } = instruction;

  return (
    <Grid
      mb="2"
      p="2"
      pt="3"
      border="1px"
      rounded="md"
      borderColor={useColorModeValue("gray.300", "gray.600")}
    >
      <Flex mb="2" alignItems="center">
        {/* TODO implement drag-and-drop */}
        {/* <DragHandleIcon h="2.5" mr="1" /> */}

        <InstructionIcon />

        <Numbering index={index} ml="2" minW="25px" />

        <Spacer />

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
                  mapToIInstruction(instruction)
                );
              });
            }}
          />
        </Tooltip>
      </Flex>

      <Box ml="10">
        <AccountSummary summary={accountSummary} />
      </Box>

      {(innerInstructions?.length || 0) > 0 && (
        <Flex ml="10" mt="1">
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
