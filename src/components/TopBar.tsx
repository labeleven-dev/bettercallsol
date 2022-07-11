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
  Tooltip,
} from "@chakra-ui/react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { FaRedo, FaUndo, FaWrench } from "react-icons/fa";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

export const TopBar: React.FC = () => (
  <Flex p="2" mb="2" bg="main.800">
    <DarkMode>
      <Image w="40px" h="40px" src="/logo128.png" alt="Logo" />
      <Text m="2" as="strong" color="white">
        Better Call SOL
      </Text>
      <Spacer />
      {/* TODO implement */}
      <Tooltip label="Undo">
        <IconButton
          mr="0.5"
          aria-label="Undo"
          icon={<Icon as={FaUndo} />}
          variant="ghost"
          color="white"
          isDisabled
        />
      </Tooltip>
      {/* TODO implement */}
      <Tooltip label="Redo">
        <IconButton
          mr="4"
          aria-label="Redo"
          icon={<Icon as={FaRedo} />}
          variant="ghost"
          color="white"
          isDisabled
        />
      </Tooltip>
    </DarkMode>
    <ColorModeSwitcher justifySelf="flex-end" />
    <DarkMode>
      {/* TODO implement */}
      <Tooltip label="Settings">
        <IconButton
          mr="0.5"
          aria-label="Settings"
          icon={<Icon as={FaWrench} />}
          variant="ghost"
          color="white"
          isDisabled
        />
      </Tooltip>
      {/* TODO implement */}
      <Tooltip label="Help">
        <IconButton
          mr="0.5"
          aria-label="Help"
          icon={<QuestionIcon />}
          variant="ghost"
          color="white"
          isDisabled
        />
      </Tooltip>
      <Box sx={{ ".wallet-adapter-button": { height: "40px" } }}>
        <WalletMultiButton />
      </Box>
    </DarkMode>
  </Flex>
);
