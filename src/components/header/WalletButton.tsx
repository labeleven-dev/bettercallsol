import {
  Box,
  Heading,
  List,
  ListIcon,
  ListItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React from "react";
import { FaLightbulb, FaWallet } from "react-icons/fa";
import { usePersistentStore } from "../../hooks/usePersistentStore";

export const WalletButton: React.FC = () => {
  const { firstTime, set } = usePersistentStore((state) => state);
  const isWideEnough = useBreakpointValue({ base: false, md: true });

  return (
    <Popover
      placement="bottom-start"
      closeOnBlur={false}
      isOpen={firstTime && isWideEnough}
      onClose={() => {
        set((state) => {
          state.firstTime = false;
        });
      }}
    >
      <PopoverTrigger>
        <Box
          mr="0.5"
          sx={{
            ".wallet-adapter-button": {
              height: "40px",
              fontSize: "13px",
              backgroundColor: "#1A202C",
            },
          }}
        >
          <WalletMultiButton />
        </Box>
      </PopoverTrigger>
      <PopoverContent bg={useColorModeValue("cyan.100", "cyan.900")}>
        <PopoverArrow bg={useColorModeValue("cyan.100", "cyan.900")} />
        <PopoverCloseButton />
        <PopoverHeader>
          <Heading size="md" mt="2" mb="2">
            Welcome to Better Call SOL!
          </Heading>
        </PopoverHeader>
        <PopoverBody>
          To get started:
          <List ml="3" mt="2">
            <ListItem>
              <ListIcon as={FaWallet} />
              Connect your wallet
            </ListItem>
            <ListItem>
              <ListIcon as={FaLightbulb} />
              Try out one of the examples from the menu
            </ListItem>
          </List>
          <br />
          <Text as="i">We recommend starting off in Devnet.</Text>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
