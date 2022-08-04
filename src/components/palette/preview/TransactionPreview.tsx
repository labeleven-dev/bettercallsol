import {
  AddIcon,
  CheckCircleIcon,
  ExternalLinkIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import {
  Flex,
  Grid,
  Icon,
  IconButton,
  Link,
  Spacer,
  Tag,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSessionStoreWithUndo } from "../../../hooks/useSessionStore";
import { mapITransactionPreviewToITransaction } from "../../../models/preview-mappers";
import { ITransactionPreview } from "../../../models/preview-types";
import { short } from "../../../models/web3js-mappers";
import { CopyButton } from "../../common/CopyButton";
import { AccountSummary } from "./AccountSummary";
import { InstructionPreview } from "./InstructionPreview";

export const TransactionPreview: React.FC<{
  transaction: ITransactionPreview;
  interactive?: boolean;
}> = ({ transaction, interactive = true }) => {
  const {
    source,
    sourceValue,
    name,
    rpcEndpoint,
    instructions,
    accountSummary,
    error,
  } = transaction;

  const setTransaction = useSessionStoreWithUndo(
    (state) => () =>
      state.set((state) => {
        state.transaction = mapITransactionPreviewToITransaction(transaction);
      })
  );

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
      <Flex mb="3" alignItems="center">
        {/* TODO implement drag-and-drop */}
        {/* <DragHandleIcon h="2.5" mt="1" mr="1" /> */}

        <TransactionIcon />

        {source === "tx" ? (
          <>
            <Tooltip label={sourceValue}>
              <Text ml="2" mr="1" as="kbd" fontSize="sm">
                {short(sourceValue)}
              </Text>
            </Tooltip>
            <CopyButton size="xs" mr="1" value={sourceValue} />
            {error ? (
              <Tooltip label={`Transaction failed: ${error}`}>
                <WarningIcon color="red.400" />
              </Tooltip>
            ) : (
              <Tooltip label="Transaction succeeded">
                <CheckCircleIcon color="green.400" />
              </Tooltip>
            )}
            <Tooltip label={rpcEndpoint!.network}>
              <Tag ml="1" size="sm" colorScheme="yellow">
                {rpcEndpoint!.network[0].toUpperCase()}
              </Tag>
            </Tooltip>
          </>
        ) : (
          <>
            <Text ml="2" mr="1" as="kbd" fontSize="sm">
              {name || "Transaction"}
            </Text>
            {source === "shareUrl" ? (
              <Tag fontSize="xs">
                <Link href={sourceValue} isExternal>
                  URL <ExternalLinkIcon />
                </Link>
              </Tag>
            ) : (
              <Tag fontSize="xs">JSON</Tag>
            )}
          </>
        )}

        <Spacer />

        {interactive && (
          <Tooltip label="Add all instructions to transaction">
            <IconButton
              size="xs"
              variant="ghost"
              aria-label="Add all instructions to transaction"
              icon={<AddIcon />}
              onClick={setTransaction}
            />
          </Tooltip>
        )}
      </Flex>

      {accountSummary && (
        <AccountSummary ml="10" mt="3" mb="5" summary={accountSummary} />
      )}

      {instructions.map((instruction, index) => (
        <InstructionPreview
          key={index}
          index={index}
          instruction={instruction}
          interactive={interactive}
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
