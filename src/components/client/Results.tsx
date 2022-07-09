import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Code,
  Flex,
  FormLabel,
  Grid,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Skeleton,
  Stack,
  Tag,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { useTransactionStore } from "../../store";
import { CopyButton } from "../common/CopyButton";
import { ExplorerButton } from "../common/ExplorerButton";

export const Results: React.FC = () => {
  const results = useTransactionStore((state) => state.results);

  return (
    <Grid
      p="3"
      border="1px"
      rounded="md"
      borderColor={useColorModeValue("gray.100", "gray.600")}
    >
      <Flex>
        <Heading mb="6" mr="3" size="md">
          Results
        </Heading>
        {results.confirmationStatus && (
          <Tag
            mr="1"
            colorScheme={
              results.confirmationStatus === "processed"
                ? "yellow"
                : results.confirmationStatus === "confirmed"
                ? "blue"
                : "green"
            }
            height="20px"
          >
            {results.confirmationStatus === "processed"
              ? "Processed"
              : results.confirmationStatus === "confirmed"
              ? `Confirmed by ${results.confirmations}`
              : `Finalised by max confirmations`}
          </Tag>
        )}
      </Flex>
      {results.error && (
        <Alert mb="5" status="error" fontSize="md" rounded="sm">
          <AlertIcon />
          <AlertDescription>{results.error}</AlertDescription>
        </Alert>
      )}
      <Flex>
        <FormLabel
          pt="2"
          mb="3"
          htmlFor="signature"
          textAlign="right"
          fontSize="sm"
        >
          Signature
        </FormLabel>
        <InputGroup flex="1" mr="1" size="sm">
          <Input
            id="signature"
            placeholder="Transaction Signature"
            isReadOnly
            value={results.signature}
          />
          <InputRightElement>
            <ExplorerButton
              type="tx"
              isDisabled={!results.signature}
              value={results.signature}
            />
          </InputRightElement>
        </InputGroup>
        <CopyButton isDisabled={!results.signature} value={results.signature} />
      </Flex>
      <Flex mb="4">
        <Box width="70px" />
        {results.slot && (
          <Tag mr="1">
            <strong>Slot:&nbsp;</strong> {results.slot}
          </Tag>
        )}
        {results.fee && (
          <Tag mr="1">
            <strong>Fee:&nbsp;</strong> {results.fee} {/* TODO in SOL */}
          </Tag>
        )}
      </Flex>

      {results.inProgress ? (
        <Stack>
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </Stack>
      ) : (
        results.logs && (
          <Grid p="3" backgroundColor="gray.700" rounded="sm">
            {results.logs.map((line, index) => (
              <Code
                key={index}
                fontSize="sm"
                textColor="main.200"
                bgColor="gray.700"
              >
                {line}
              </Code>
            ))}
          </Grid>
        )
      )}
    </Grid>
  );
};
