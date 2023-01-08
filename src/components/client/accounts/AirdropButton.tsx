import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
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
  Portal,
  Text,
  Tooltip,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useSessionStoreWithUndo } from "hooks/useSessionStore";
import { useTransactionStatusToast } from "hooks/useTransactionStatusToast";
import { useWeb3Connection } from "hooks/useWeb3Connection";
import React, { useRef, useState } from "react";
import { FaParachuteBox } from "react-icons/fa";
import { IPubKey } from "types/internal";
import { toLamports } from "utils/web3js";

export const AirdropButton: React.FC<{ accountPubkey: IPubKey }> = ({
  accountPubkey,
}) => {
  const [value, setValue] = useState("1.0");
  const rpcEndpoint = useSessionStoreWithUndo((state) => state.rpcEndpoint);
  const initialFocusRef = useRef(null);

  const connection = useWeb3Connection();
  const { toast: transactionStatusToast } =
    useTransactionStatusToast("Air Drop");
  const toast = useToast();

  const airdop = () => {
    connection
      .requestAirdrop(
        new PublicKey(accountPubkey),
        parseInt(value) * LAMPORTS_PER_SOL
      )
      .then((signature) => {
        transactionStatusToast(signature);
      })
      .catch((e) => {
        toast({
          position: "top-right",
          status: "error",
          title: `Air Drop has failed.`,
          description: `Error: ${e}`,
          duration: 10_000,
          isClosable: true,
        });
      });
  };

  return (
    <Popover placement="left" initialFocusRef={initialFocusRef} isLazy>
      <Tooltip label="Airdop SOL">
        {/* cannot use tooltips directly on trigger 
            https://github.com/chakra-ui/chakra-ui/issues/2843 */}
        <Box display="inline-block">
          <PopoverTrigger>
            <IconButton
              size="xs"
              variant="ghost"
              aria-label="Airdrop SOL"
              icon={<FaParachuteBox />}
            />
          </PopoverTrigger>
        </Box>
      </Tooltip>

      {/* avoid z-index issues with it rendering before other compoents that may clash with it */}
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />

          <PopoverHeader>
            <Heading size="sm">Airdrop SOL</Heading>
          </PopoverHeader>

          <PopoverBody>
            <VStack p="2" spacing="2">
              <Flex alignItems="center">
                <NumberInput
                  size="sm"
                  min={0}
                  precision={9}
                  allowMouseWheel
                  value={value.toLocaleString()}
                  onChange={setValue}
                >
                  <NumberInputField
                    ref={initialFocusRef}
                    fontFamily="mono"
                    textAlign="center"
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Text ml="2" fontSize="md">
                  SOL
                </Text>
              </Flex>

              <Text as="i" fontSize="sm">{`${(toLamports(value) || 0).toFormat(
                0
              )} Lamports`}</Text>
            </VStack>
          </PopoverBody>
          <PopoverFooter>
            <Center>
              <Button
                size="sm"
                colorScheme="teal"
                leftIcon={<Icon as={FaParachuteBox} />}
                onClick={airdop}
              >
                Airdop
              </Button>
            </Center>
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
