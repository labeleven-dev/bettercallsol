import { RepeatIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  FormLabel,
  Grid,
  GridItem,
  IconButton,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spinner,
  Switch,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { AccountAutoComplete } from "components/common/AccountAutoComplete";
import { ExpandableSection } from "components/common/ExpandableSection";
import { useTransactionPda } from "hooks/squads";
import { useSessionStoreWithUndo } from "hooks/useSessionStore";
import { useState } from "react";

export const SquadsConfig: React.FC = () => {
  const [{ programId, multisig, authorityIndex, activateTransaction }, set] =
    useSessionStoreWithUndo((state) => [state.squadsConfig, state.set]);

  const [transactionPda, setTransactionPda] = useState("");
  const { isFetching: transactionPdaIsLoading, refetch: getTransactionPda } =
    useTransactionPda(programId, multisig, (pubkey) => {
      if (!!pubkey) {
        setTransactionPda(pubkey.toBase58());
      }
    });

  const transactionPdaBackground = useColorModeValue(
    "blackAlpha.300",
    "whiteAlpha.300"
  );

  return (
    <ExpandableSection heading="Integration: Squads Configuration">
      <Grid templateColumns="1fr 4fr" gap="5px 5px" alignItems="center">
        <FormLabel htmlFor="squads-program-id" textAlign="right">
          Squads program
        </FormLabel>
        <AccountAutoComplete
          types={["input", "program"]}
          chakraInputProps={{
            id: "squads-program-id",
            size: "sm",
            placeholder: "Start typing...",
          }}
          pubkey={programId}
          setPubkey={(pubkey) => {
            set((state) => {
              state.squadsConfig.programId = pubkey.trim();
            });
          }}
          filter={({ label }) => label.indexOf("Squads") >= 0}
        />

        <FormLabel
          htmlFor="squads-multisig"
          textAlign="right"
          verticalAlign="middle"
        >
          Multisig account
        </FormLabel>
        <Input
          id="squads-multisig"
          size="sm"
          fontFamily="mono"
          value={multisig}
          onChange={(event) => {
            set((state) => {
              state.squadsConfig.multisig = event.target.value;
            });
          }}
        />

        <FormLabel htmlFor="squads-authority-index" textAlign="right">
          Authority index
        </FormLabel>
        <Flex>
          <NumberInput
            size="sm"
            min={0}
            value={authorityIndex}
            onChange={(_, value) => {
              set((state) => {
                state.squadsConfig.authorityIndex = value || 0;
              });
            }}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Flex>

        <FormLabel htmlFor="squads-activate-transaction" textAlign="right">
          Activate transaction
        </FormLabel>
        <Switch
          id="squads-activate-transaction"
          size="sm"
          isChecked={activateTransaction}
          onChange={() => {
            set((state) => {
              state.squadsConfig.activateTransaction =
                !state.squadsConfig.activateTransaction;
            });
          }}
        />

        <GridItem colSpan={2} fontSize="sm" textAlign="right">
          Transaction PDA:{" "}
          {!transactionPdaIsLoading ? (
            <>
              <Box
                as="span"
                fontFamily="mono"
                p="1"
                rounded="sm"
                bgColor={transactionPdaBackground}
              >
                {transactionPda || "N/A"}
              </Box>
              {transactionPda && (
                <Tooltip label="Recalculate">
                  <IconButton
                    ml="1"
                    size="xs"
                    variant="ghost"
                    aria-label="Refresh"
                    icon={<RepeatIcon />}
                    onClick={() => {
                      getTransactionPda();
                    }}
                  />
                </Tooltip>
              )}
            </>
          ) : (
            <Spinner size="xs" />
          )}
        </GridItem>
      </Grid>
    </ExpandableSection>
  );
};
