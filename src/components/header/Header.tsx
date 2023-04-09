import { InfoIcon } from "@chakra-ui/icons";
import {
  Flex,
  Hide,
  Icon,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  Tooltip,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { ToggleIconButton } from "components/common/ToggleIconButton";
import { ColorModeSwitcher } from "components/header/ColorModeSwitcher";
import { Example } from "components/header/Examples";
import { WalletButton } from "components/header/WalletButton";
import { useSessionStoreWithoutUndo } from "hooks/useSessionStore";
import { useState } from "react";
import { FaEllipsisH, FaInfo, FaShareAlt, FaWrench } from "react-icons/fa";

export const Header: React.FC = () => {
  const [funTitle, setFunTitle] = useState(true);
  const toast = useToast();
  const [descriptionVisible, set] = useSessionStoreWithoutUndo((state) => [
    state.uiState.descriptionVisible,
    state.set,
  ]);

  return (
    <Flex px="8" py="5" alignItems="center">
      <Image w="40px" h="40px" src="/logo128.png" alt="Logo" />
      <Hide below="md">
        <Text
          ml="3"
          mr="9"
          pr="2" // for cursive font to not get cut off
          fontFamily={funTitle ? "'Dancing Script', cursive;" : ""}
          fontWeight="extrabold"
          fontSize={funTitle ? "3xl" : "xl"}
          bgGradient={useColorModeValue(
            "linear(to-r, #ff2915, #dfac01)",
            "linear(to-r, #ff6f61ff, #fece2f)"
          )}
          bgClip="text"
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
          Better Call Sol
        </Text>
        <Example />
      </Hide>

      <Spacer />

      {/* TODO implement */}
      {/* <Hide below="md">
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
        </Hide> */}

      <ToggleIconButton
        ml="1"
        label={descriptionVisible ? "Hide annotations" : "Display annotations"}
        icon={<Icon as={FaInfo} />}
        toggled={descriptionVisible}
        onToggle={(toggled) => {
          set((state) => {
            state.uiState.descriptionVisible = toggled;
          });
        }}
      />

      <Tooltip label="Share">
        <IconButton
          aria-label="Share"
          icon={<Icon as={FaShareAlt} />}
          variant="ghost"
          onClick={() => {
            set((state) => {
              state.uiState.shareOpen = true;
            });
          }}
        />
      </Tooltip>

      <Menu>
        <MenuButton
          as={IconButton}
          ml="1"
          mr="1"
          aria-label="More..."
          icon={<Icon as={FaEllipsisH} />}
          variant="ghost"
        />
        <MenuList fontSize="md" zIndex="modal">
          <ColorModeSwitcher />

          <MenuItem
            icon={<Icon as={FaWrench} />}
            onClick={() => {
              set((state) => {
                state.uiState.optionsOpen = true;
              });
            }}
          >
            Options
          </MenuItem>

          <MenuItem
            icon={<InfoIcon />}
            onClick={() => {
              set((state) => {
                state.uiState.infoOpen = true;
              });
            }}
          >
            Info
          </MenuItem>
        </MenuList>
      </Menu>

      <WalletButton />
    </Flex>
  );
};
