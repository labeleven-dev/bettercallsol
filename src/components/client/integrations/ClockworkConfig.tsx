import { InfoOutlineIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Link,
  NumberInput,
  NumberInputField,
  Select,
  Spacer,
  Switch,
  useColorModeValue,
} from "@chakra-ui/react";
import { ThreadProgramIdl } from "@clockwork-xyz/sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { ExpandableSection } from "components/common/ExpandableSection";
import { useSessionStoreWithUndo } from "hooks/useSessionStore";
import { useMemo } from "react";
import { ClockworkConfig as ClockworkConfigType } from "types/state";

// TODO a lot of repeated code for wiring the form to Zustand state
// TODO use a form state management framework?

export const ClockworkConfig: React.FC = () => {
  const [
    {
      threadId,
      amount,
      fee,
      rateLimit,
      trigger,
      accountTrigger,
      cronTrigger,
      epochTrigger,
      slotTrigger,
    },
    set,
  ] = useSessionStoreWithUndo((state) => [state.clockworkConfig, state.set]);
  const { publicKey: walletPublicKey } = useWallet();

  const threadPda = useMemo(() => {
    if (!walletPublicKey || !threadId) return;

    try {
      return PublicKey.findProgramAddressSync(
        [
          Buffer.from("thread"),
          walletPublicKey.toBuffer(),
          Buffer.from(threadId),
        ],
        new PublicKey(ThreadProgramIdl.metadata.address)
      )[0].toBase58();
    } catch (e) {
      return; // should only happen the seed is too long
    }
  }, [walletPublicKey, threadId]);

  return (
    <ExpandableSection heading="Integration: Clockwork Configuration">
      <Grid templateColumns="1fr 4fr" gap="5px 5px" alignItems="center">
        <GridItem colSpan={2} display="flex" mb="2">
          <Spacer />
          <Link
            href="https://docs.clockwork.xyz/"
            isExternal
            fontSize="sm"
            // line up icon and text
            display="flex"
            alignItems="center"
          >
            <InfoOutlineIcon mr="1" color="blue.500" /> Clockwork documentation
          </Link>
        </GridItem>

        <FormLabel htmlFor="clockwork-id" textAlign="right">
          Thread ID
        </FormLabel>
        <Input
          id="clockwork-id"
          size="sm"
          fontFamily="mono"
          value={threadId}
          onChange={(event) => {
            set((state) => {
              state.clockworkConfig.threadId = event.target.value;
            });
          }}
        />

        <FormLabel htmlFor="clockwork-amount" textAlign="right">
          Amount (in Lamports)
        </FormLabel>
        <Flex>
          <NumberInput
            id="clockwork-amount"
            size="sm"
            fontFamily="mono"
            min={0}
            value={amount}
            onChange={(_, value) => {
              set((state) => {
                state.clockworkConfig.amount = isNaN(value) ? 0 : value;
              });
            }}
          >
            <NumberInputField />
          </NumberInput>
        </Flex>

        <FormLabel htmlFor="clockwork-fee" textAlign="right">
          Fee (in Lamports)
        </FormLabel>
        <Flex>
          <NumberInput
            id="clockwork-fee"
            size="sm"
            fontFamily="mono"
            min={0}
            value={fee}
            onChange={(_, value) => {
              set((state) => {
                state.clockworkConfig.fee = isNaN(value) ? "" : value;
              });
            }}
          >
            <NumberInputField />
          </NumberInput>
        </Flex>

        <FormLabel htmlFor="clockwork-rate-limit" textAlign="right">
          Rate limit (per slot)
        </FormLabel>
        <Flex>
          <NumberInput
            id="clockwork-rate-limit"
            size="sm"
            fontFamily="mono"
            min={0}
            value={rateLimit}
            onChange={(_, value) => {
              set((state) => {
                state.clockworkConfig.rateLimit = isNaN(value) ? "" : value;
              });
            }}
          >
            <NumberInputField />
          </NumberInput>
        </Flex>

        <FormLabel htmlFor="clockwork-trigger" textAlign="right">
          Trigger
        </FormLabel>
        <Flex>
          <Select
            size="sm"
            value={trigger}
            onChange={(event) => {
              set((state) => {
                state.clockworkConfig.trigger = event.target
                  .value as ClockworkConfigType["trigger"];
              });
            }}
            maxW="110px"
          >
            <option value="now">Now</option>
            <option value="account">Account</option>
            <option value="cron">Cron</option>
            <option value="slot">Slot</option>
            <option value="epoch">Epoch</option>
          </Select>
        </Flex>

        {trigger === "account" && (
          <>
            <FormLabel
              htmlFor="clockwork-trigger-account-address"
              textAlign="right"
            >
              Address
            </FormLabel>
            <Input
              id="clockwork-trigger-account-address"
              size="sm"
              fontFamily="mono"
              backgroundColor="transparent" // for some reason it has an alpha
              value={accountTrigger.address}
              onChange={(event) => {
                set((state) => {
                  state.clockworkConfig.accountTrigger.address =
                    event.target.value;
                });
              }}
            />

            <FormLabel
              htmlFor="clockwork-trigger-account-offset"
              textAlign="right"
            >
              Offset
            </FormLabel>
            <Flex>
              <NumberInput
                id="clockwork-trigger-account-offset"
                size="sm"
                fontFamily="mono"
                min={0}
                value={accountTrigger.offset}
                onChange={(_, value) => {
                  set((state) => {
                    state.clockworkConfig.accountTrigger.offset = value;
                  });
                }}
              >
                <NumberInputField />
              </NumberInput>
            </Flex>

            <FormLabel
              htmlFor="clockwork-trigger-account-size"
              textAlign="right"
            >
              Size
            </FormLabel>
            <Flex>
              <NumberInput
                id="clockwork-trigger-account-size"
                size="sm"
                fontFamily="mono"
                min={0}
                value={accountTrigger.size}
                onChange={(_, value) => {
                  set((state) => {
                    state.clockworkConfig.accountTrigger.size = value;
                  });
                }}
              >
                <NumberInputField />
              </NumberInput>
            </Flex>
          </>
        )}

        {trigger === "cron" && (
          <>
            <FormLabel
              htmlFor="clockwork-trigger-cron-schedule"
              textAlign="right"
            >
              Schedule
            </FormLabel>
            <Input
              id="clockwork-trigger-cron-schedule"
              size="sm"
              fontFamily="mono"
              backgroundColor="transparent" // for some reason it has an alpha
              value={cronTrigger.schedule}
              onChange={(event) => {
                set((state) => {
                  state.clockworkConfig.cronTrigger.schedule =
                    event.target.value.trim();
                });
              }}
            />

            <FormLabel
              htmlFor="clockwork-trigger-cron-skippable"
              textAlign="right"
            >
              Skippable
            </FormLabel>
            <Switch
              id="clockwork-trigger-cron-skippable"
              size="sm"
              isChecked={cronTrigger.skippable}
              onChange={(event) => {
                set((state) => {
                  state.clockworkConfig.cronTrigger.skippable =
                    event.target.checked;
                });
              }}
            />
          </>
        )}

        {trigger === "slot" && (
          <>
            <FormLabel htmlFor="clockwork-trigger-slot-slot" textAlign="right">
              Slot
            </FormLabel>
            <Flex>
              <NumberInput
                id="clockwork-trigger-slot-slot"
                size="sm"
                fontFamily="mono"
                min={0}
                value={slotTrigger.slot}
                onChange={(_, value) => {
                  set((state) => {
                    state.clockworkConfig.slotTrigger.slot = value;
                  });
                }}
              >
                <NumberInputField />
              </NumberInput>
            </Flex>
          </>
        )}

        {trigger === "epoch" && (
          <>
            <FormLabel
              htmlFor="clockwork-trigger-epoch-epoch"
              textAlign="right"
            >
              Epoch
            </FormLabel>
            <Flex>
              <NumberInput
                id="clockwork-trigger-epoch-epoch"
                size="sm"
                fontFamily="mono"
                min={0}
                value={epochTrigger.epoch}
                onChange={(_, value) => {
                  set((state) => {
                    state.clockworkConfig.epochTrigger.epoch = value;
                  });
                }}
              >
                <NumberInputField />
              </NumberInput>
            </Flex>
          </>
        )}

        <GridItem colSpan={2} fontSize="sm" textAlign="right">
          Thread PDA:{" "}
          <Box
            as="span"
            fontFamily="mono"
            p="1"
            rounded="sm"
            bgColor={useColorModeValue("blackAlpha.300", "whiteAlpha.300")}
          >
            {threadPda || "N/A"}
          </Box>
        </GridItem>
      </Grid>
    </ExpandableSection>
  );
};
