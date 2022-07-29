import { HamburgerIcon, QuestionIcon } from "@chakra-ui/icons";
import {
  DarkMode,
  Flex,
  Hide,
  Icon,
  IconButton,
  Image,
  Spacer,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaRedo, FaUndo, FaWrench } from "react-icons/fa";
import { useTransactionStore } from "../../hooks/useTransactionStore";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Example } from "./Examples";
import { WalletButton } from "./WalletButton";

export const Header: React.FC = () => {
  const [funTitle, setFunTitle] = useState(false);
  const toast = useToast();
  const set = useTransactionStore((state) => state.set);

  return (
    <Flex p="2" bgColor="main.800">
      <DarkMode>
        <Image w="40px" h="40px" src="/logo128.png" alt="Logo" />

        <Text
          ml="3"
          mr="9"
          mt={funTitle ? "1.5" : "2"}
          color="white"
          fontFamily={funTitle ? "'Dancing Script', cursive;" : ""}
          fontWeight="bold"
          fontSize={funTitle ? "xl" : "lg"}
          onClick={() => {
            toast({
              title: funTitle
                ? "Serious Business Mode™️ enabled!"
                : "Serious Business Mode™️ disabled!",
              status: funTitle ? "warning" : "success",
              duration: 1000,
              isClosable: true,
            });
            setFunTitle(!funTitle);
          }}
        >
          <Hide below="md">Better Call SOL</Hide>
        </Text>

        <Example />

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
      </DarkMode>

      <WalletButton />

      <DarkMode>
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
