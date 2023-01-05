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
import { CopyButton } from "components/common/CopyButton";
import { InstructionPreview } from "components/palette/preview/InstructionPreview";
import { TransactionAccountSummary } from "components/palette/preview/TranasctionAccountSummary";
import { useSessionStoreWithUndo } from "hooks/useSessionStore";
import { mapIPreviewToITransaction } from "mappers/preview-to-internal";
import { FaAnchor } from "react-icons/fa";
import { IPreview, PreviewSource } from "types/preview";
import { short } from "utils/web3js";

export const Preview: React.FC<{
  preview: IPreview;
  interactive?: boolean;
}> = ({ preview, interactive = true }) => {
  const {
    source,
    sourceValue,
    version,
    name,
    rpcEndpoint,
    instructions,
    accountSummary,
    error,
  } = preview;

  const addAll = useSessionStoreWithUndo(
    (state) => () =>
      state.set((state) => {
        state.transaction = mapIPreviewToITransaction(preview);
      })
  );

  const isSource = (...sources: PreviewSource[]) => sources.includes(source);

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
        {/* <DragHandle unlockedProps={{ h: "2.5", mt: "1", mr: "1" }} /> */}

        {/* icon */}
        {isSource("anchorProgramId", "anchorJson") && <AnchorIcon />}
        {isSource("tx", "shareUrl", "shareJson") && <TransactionIcon />}

        {/* main value */}
        {isSource("tx") && (
          <>
            <Tooltip label={sourceValue}>
              <Text ml="2" mr="1" as="kbd" fontSize="sm">
                {short(sourceValue)}
              </Text>
            </Tooltip>
            <CopyButton size="xs" mr="1" value={sourceValue} />
          </>
        )}
        {isSource("shareJson", "shareUrl") && (
          <Text ml="2" mr="1" as="kbd" fontSize="sm">
            {name || "Transaction"}
          </Text>
        )}
        {isSource("anchorProgramId") && (
          <Tooltip label={sourceValue}>
            <Text as="b" ml="2" mr="1" fontSize="sm">
              {name}
            </Text>
          </Tooltip>
        )}
        {isSource("anchorJson") && (
          <Text as="b" ml="2" mr="1" fontSize="sm">
            {name}
          </Text>
        )}

        {/* transaction status */}
        {isSource("tx") &&
          (error ? (
            <Tooltip label={`Transaction failed: ${error}`}>
              <WarningIcon mr="1" color="red.400" />
            </Tooltip>
          ) : (
            <Tooltip label="Transaction succeeded">
              <CheckCircleIcon mr="1" color="green.400" />
            </Tooltip>
          ))}

        {/* network */}
        {isSource("tx", "anchorProgramId") && (
          <Tooltip label={rpcEndpoint!.network}>
            <Tag mr="1" size="sm" colorScheme="yellow">
              {rpcEndpoint!.network[0].toUpperCase()}
            </Tag>
          </Tooltip>
        )}
        {isSource("shareUrl") && (
          <Tag mr="1" fontSize="xs">
            <Link href={sourceValue} isExternal>
              URL <ExternalLinkIcon />
            </Link>
          </Tag>
        )}
        {isSource("shareJson", "anchorJson") && (
          <Tag mr="1" fontSize="xs">
            JSON
          </Tag>
        )}

        <Tooltip label={`Transaction version: ${version}`}>
          <Tag mr="1" fontSize="xs">
            {version === "legacy" ? "LEGACY" : `v${version}`}
          </Tag>
        </Tooltip>

        <Spacer />

        {interactive && (
          <Tooltip label="Add all instructions to transaction">
            <IconButton
              size="xs"
              variant="ghost"
              aria-label="Add all instructions to transaction"
              icon={<AddIcon />}
              onClick={addAll}
            />
          </Tooltip>
        )}
      </Flex>

      {accountSummary && (
        <TransactionAccountSummary ml="5" mb="3" summary={accountSummary} />
      )}

      {instructions.map((instruction, index) => (
        <InstructionPreview
          key={index}
          index={index}
          instruction={instruction}
          source={source}
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

const AnchorIcon: React.FC = () => (
  <Icon as={FaAnchor} color={useColorModeValue("green.400", "green.200")} />
);
