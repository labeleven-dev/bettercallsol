import {
  Flex,
  Icon,
  Tag,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { IAccountSummary } from "../../../models/preview-types";

export const AccountSummary: React.FC<{
  summary: IAccountSummary;
}> = ({
  summary: {
    total,
    writableSigner,
    readonlySigner,
    writableUnsigned,
    readonlyUsigned,
  },
}) => {
  const tags = [
    {
      label: "🖊️ R/W",
      tooltip: "Writable Signer",
      count: writableSigner,
      colourScheme: "green",
    },
    {
      label: "R/W ",
      tooltip: "Writable",
      count: writableUnsigned,
      colourScheme: "blue",
    },
    {
      label: "🖊️ R/O",
      tooltip: "Readonly Signer",
      count: readonlySigner,
      colourScheme: "yellow",
    },
    {
      label: "R/O",
      tooltip: "Readonly",
      count: readonlyUsigned,
      colourScheme: "",
    },
  ].filter(({ count }) => count > 0);

  return (
    <Flex alignItems="center">
      <Tooltip label="Accounts">
        <Flex>
          <AccountIcon />
          <Text ml="2" mr="4" fontSize="sm">
            {total}
          </Text>
        </Flex>
      </Tooltip>

      {tags.map(({ label, tooltip, count, colourScheme }, index) => (
        <Tooltip key={index} label={tooltip}>
          <Tag mr="1" size="sm" colorScheme={colourScheme}>
            {label}: {count}
          </Tag>
        </Tooltip>
      ))}
    </Flex>
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
