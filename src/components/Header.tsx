import { HamburgerIcon, QuestionIcon } from "@chakra-ui/icons";
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
import { useTransactionStore } from "../hooks/useTransactionStore";
import { ColorModeSwitcher } from "./common/ColorModeSwitcher";

export const Header: React.FC = () => {
  const set = useTransactionStore((state) => state.set);

  return (
    <Flex p="2" bgColor="main.800">
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
        <Tooltip label="Options">
          <IconButton
            mr="0.5"
            aria-label="Options"
            icon={<Icon as={FaWrench} />}
            variant="ghost"
            color="white"
            onClick={() => {
              set((state) => {
                state.uiState.optionsOpen = true;
              });
            }}
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
        <Box mr="0.5" sx={{ ".wallet-adapter-button": { height: "40px" } }}>
          <WalletMultiButton />
        </Box>
        <Tooltip label="Palette">
          <IconButton
            mr="0.5"
            aria-label="Palette"
            icon={<HamburgerIcon />}
            variant="ghost"
            color="white"
            onClick={() => {
              set((state) => {
                state.uiState.paletteOpen = !state.uiState.paletteOpen;
              });
            }}
          />
        </Tooltip>
      </DarkMode>
    </Flex>
  );
};
