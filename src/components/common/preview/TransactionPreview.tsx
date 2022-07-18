import { AddIcon, CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
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
import { useTransactionStore } from "../../../hooks/useTransactionStore";
import {
  ITransactionPreview,
  mapToIInstruction,
} from "../../../models/preview";
import { short } from "../../../models/web3";
import { CopyButton } from "../CopyButton";
import { ExplorerButton } from "../ExplorerButton";
import { AccountSummary } from "./AccountSummary";
import { InstructionPreview } from "./InstructionPreview";

export const TransactionPreview: React.FC<{
  transaction: ITransactionPreview;
}> = ({ transaction: { signature, instructions, accountSummary, error } }) => {
  const addInstruction = useTransactionStore((state) => state.addInstruction);

  const addInstructions = () => {
    instructions.forEach((instruction) => {
      addInstruction(mapToIInstruction(instruction));
    });
  };

  return (
    <Grid
      border="1px"
      rounded="sm"
      p="3"
      pb="2"
      bgColor={useColorModeValue("", "whiteAlpha.50")}
      boxShadow={useColorModeValue("base", "")}
      borderColor={useColorModeValue("gray.200", "gray.600")}
    >
      <Flex mb="2">
        {/* TODO implement drag-and-drop */}
        {/* <DragHandleIcon h="2.5" mt="1" mr="1" /> */}
        <TransactionIcon />
        <Tooltip label={signature}>
          <Text ml="2" mr="1" as="kbd" fontSize="sm">
            {short(signature)}
          </Text>
        </Tooltip>
        <Box mt="-1" mr="1">
          <CopyButton size="xs" value={signature} />
        </Box>
        {error ? (
          <Tooltip label={`Transaction failed: ${error}`}>
            <WarningIcon mt="0.5" color="red.400" />
          </Tooltip>
        ) : (
          <Tooltip label="Transaction succeeded">
            <CheckCircleIcon mt="0.5" color="green.400" />
          </Tooltip>
        )}

        <Spacer />

        <Box mt="-1.5" ml="-2">
          <ExplorerButton size="xs" valueType="tx" value={signature} />
        </Box>
        <Tooltip label="Add all instructions to transaction">
          <IconButton
            mt="-1"
            size="xs"
            variant="ghost"
            aria-label="Add all instructions to transaction"
            icon={<AddIcon />}
            onClick={addInstructions}
          />
        </Tooltip>
      </Flex>

      <Box ml="10" mb="5">
        <AccountSummary summary={accountSummary} />
      </Box>

      {instructions.map((instruction, index) => (
        <InstructionPreview
          key={index}
          index={index}
          instruction={instruction}
        />
      ))}
    </Grid>
  );
};

const TransactionIcon: React.FC = () => (
  <Icon viewBox="0 0 64 64" color={useColorModeValue("green.400", "green.200")}>
    <path
      d="M32 2C15.432 2 2 15.431 2 32c0 16.569 13.432 30 30 30s30-13.432 30-30C62 15.431 48.568 2 32 2m11.754 20.629h-8.682v23.878h-6.104V22.629h-8.721v-5.138h23.506v5.138z"
      fill="currentColor"
    ></path>
  </Icon>
);
