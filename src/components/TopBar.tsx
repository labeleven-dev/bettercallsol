import { QuestionIcon } from "@chakra-ui/icons";
import {
  Box,
  DarkMode,
  Flex,
  Icon,
  IconButton,
  Image,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { FaWrench } from "react-icons/fa";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

export const TopBar: React.FC = () => (
  <Flex p="2" mb="2" bg="main.800">
    <DarkMode>
      <Image w="40px" h="40px" src="/logo128.png" alt="Logo" />
      <Text m="2" as="strong" color="white">
        BetterCallSol
      </Text>
      <Spacer />
    </DarkMode>
    <ColorModeSwitcher justifySelf="flex-end" />
    <DarkMode>
      <IconButton
        mr="0.5"
        aria-label="Help"
        icon={<Icon as={FaWrench} />}
        variant="ghost"
        color="white"
      />
      <IconButton
        mr="0.5"
        aria-label="Help"
        icon={<QuestionIcon />}
        variant="ghost"
        color="white"
      />
      <Box sx={{ ".wallet-adapter-button": { height: "40px" } }}>
        <WalletMultiButton />
      </Box>
    </DarkMode>
  </Flex>
);
