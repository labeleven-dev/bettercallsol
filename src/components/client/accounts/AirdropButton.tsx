import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Heading,
  HStack,
  Icon,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React, { useState } from "react";
import { FaParachuteBox } from "react-icons/fa";
import { useGetWeb3Transaction } from "../../../hooks/useGetWeb3Transaction";
import { usePersistentStore } from "../../../hooks/usePersistentStore";
import { IPubKey } from "../../../models/internal-types";
import { toLamports } from "../../../models/web3js-mappers";

export const AirdropButton: React.FC<{ accountPubkey: IPubKey }> = ({
  accountPubkey,
}) => {
  const [value, setValue] = useState("1.000000000");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "running" | "success" | "fail">(
    "idle"
  );
  const rpcEndpoint = usePersistentStore(
    (state) => state.transactionOptions.rpcEndpoint
  );

  const { connection } = useConnection();
  const {
    // TODO once we have link explorer, set it in
    // signature,
    start: startConfirmation,
    cancel,
  } = useGetWeb3Transaction({
    onStatus: (status) => {
      setMessage(`Confirmed by ${status.confirmations || 0}`);
    },
    onFinalised: () => {
      setMessage("Airdop has been successful");
      setStatus("success");
    },
    onError: (error) => {
      setMessage(`Error: ${error.message}`);
      setStatus("fail");
    },
    onTimeout: () => {
      setMessage("Error: Time out");
      setStatus("fail");
    },
  });

  const airdop = () => {
    setStatus("running");
    setMessage("Sending transcation...");
    connection
      .requestAirdrop(new PublicKey(accountPubkey), parseInt(value))
      .then((signature) => {
        startConfirmation(signature);
      });
  };

  return (
    <Popover placement="left">
      <PopoverTrigger>
        {/* TODO tooltips don't play nice with Popovers */}
        <IconButton
          size="xs"
          variant="ghost"
          aria-label="Airdrop SOL"
          icon={<FaParachuteBox />}
          isDisabled={rpcEndpoint.network === "mainnet-beta"}
        />
      </PopoverTrigger>

      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>
          <Heading size="sm">Airdrop SOL</Heading>
        </PopoverHeader>
        <PopoverBody>
          <VStack mt="2" mb="3">
            <Text mb="2">Add more SOL to this account.</Text>

            <NumberInput
              size="sm"
              min={0}
              precision={9}
              allowMouseWheel
              value={value.toLocaleString()}
              onChange={setValue}
            >
              <NumberInputField fontFamily="mono" textAlign="center" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>

            <Text as="i">{`${(toLamports(value) || 0).toFormat(
              0
            )} Lamports`}</Text>
          </VStack>
        </PopoverBody>
        <PopoverFooter>
          {message && (
            <HStack mb="3" justifyContent="center">
              {status === "running" && <Spinner color="blue.400" size="sm" />}
              {status === "success" && <CheckCircleIcon color="green.400" />}
              {status === "fail" && <WarningIcon color="red.400" />}
              <Text
                textColor={
                  status === "running"
                    ? "blue.400"
                    : status === "success"
                    ? "green.400"
                    : status === "fail"
                    ? "red.400"
                    : undefined
                }
              >
                {message}
              </Text>
            </HStack>
          )}
          <Center mt="1" mb="1">
            {status === "running" ? (
              <Button
                size="sm"
                colorScheme="red"
                leftIcon={<Icon as={FaParachuteBox} />}
                onClick={cancel}
              >
                Cancel
              </Button>
            ) : (
              <Button
                size="sm"
                colorScheme="teal"
                leftIcon={<Icon as={FaParachuteBox} />}
                onClick={airdop}
              >
                Airdop
              </Button>
            )}
          </Center>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};
