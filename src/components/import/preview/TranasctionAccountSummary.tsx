import {
  Flex,
  FlexProps,
  Icon,
  Tag,
  Text,
  Tooltip,
  useColorModeValue,
  Wrap,
} from "@chakra-ui/react";
import React from "react";
import { ITransactionAccountSummary } from "types/preview";

export const TransactionAccountSummary: React.FC<
  {
    summary: ITransactionAccountSummary;
  } & FlexProps
> = ({
  summary: {
    staticKeys,
    signatures,
    readonlySigned,
    readonlyUnsigned,
    lookupTables,
    writableLookup,
    readonlyLookup,
  },
  ...theRest
}) => {
  const staticTags = [
    {
      label: "Total",
      tooltip: "Total static accounts",
      count: staticKeys,
      colourScheme: "blue",
    },
    {
      label: "🖊️",
      tooltip: "Required signatures",
      count: signatures,
      colourScheme: "blue",
    },
    {
      label: "🖊️ R/O",
      tooltip: "Readonly static signer",
      count: readonlySigned,
      colourScheme: "blue",
    },
    {
      label: "R/O",
      tooltip: "Readonly static account",
      count: readonlyUnsigned,
      colourScheme: "blue",
    },
  ].filter(({ count }) => count > 0);

  const lookupTags = [
    {
      label: "LUT",
      tooltip: "Address lookup tables",
      count: lookupTables,
      colourScheme: "yellow",
    },
    {
      label: "Total",
      tooltip: "Total looked-up addresses",
      count: writableLookup + readonlyLookup,
      colourScheme: "yellow",
    },
    {
      label: "R/W",
      tooltip: "Writable looked-up addresses",
      count: writableLookup,
      colourScheme: "yellow",
    },
    {
      label: "R/O",
      tooltip: "Readonly looked-up addresses",
      count: readonlyLookup,
      colourScheme: "yellow",
    },
  ].filter(({ count }) => count > 0);

  return (
    <>
      {staticKeys > 0 && (
        <Flex {...theRest} alignItems="center">
          <Tooltip label="Static accounts">
            <Flex>
              <AccountIcon />
              <Text ml="2" mr="6" fontSize="sm">
                Static
              </Text>
            </Flex>
          </Tooltip>

          <Wrap spacing={1}>
            {staticTags.map(
              ({ label, tooltip, count, colourScheme }, index) => (
                <Tooltip key={index} label={tooltip}>
                  <Tag mr="1" size="sm" colorScheme={colourScheme}>
                    {label}: {count}
                  </Tag>
                </Tooltip>
              )
            )}
          </Wrap>
        </Flex>
      )}

      {lookupTables > 0 && (
        <Flex {...theRest} alignItems="center">
          <Tooltip label="Looked-up Accounts">
            <Flex>
              <AccountIcon />
              <Text ml="2" mr="2" fontSize="sm">
                Lookup
              </Text>
            </Flex>
          </Tooltip>

          <Wrap ml="2" spacing={1}>
            {lookupTags.map(
              ({ label, tooltip, count, colourScheme }, index) => (
                <Tooltip key={index} label={tooltip}>
                  <Tag mr="1" size="sm" colorScheme={colourScheme}>
                    {label}: {count}
                  </Tag>
                </Tooltip>
              )
            )}
          </Wrap>
        </Flex>
      )}
    </>
  );
};

const AccountIcon: React.FC = () => (
  <Icon viewBox="0 0 64 64" color={useColorModeValue("blue.400", "blue.200")}>
    <path d="M28.216 35.543h7.431l-3.666-11.418z" fill="currentColor"></path>
    <path
      d="M32 2C15.432 2 2 15.431 2 32c0 16.569 13.432 30 30 30s30-13.432 30-30C62 15.431 48.568 2 32 2m7.167 44.508l-1.914-5.965H26.567L24.6 46.508h-6.342l10.358-29.016h6.859l10.266 29.016h-6.574"
      fill="currentColor"
    ></path>
  </Icon>
);
