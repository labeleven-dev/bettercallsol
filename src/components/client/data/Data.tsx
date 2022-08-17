import { LockIcon } from "@chakra-ui/icons";
import {
  Box,
  Divider,
  Flex,
  Heading,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  TabProps,
  Tabs,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useInstruction } from "../../../hooks/useInstruction";
import { IInstructionData } from "../../../types/internal";
import { DataEditor } from "./editor/DataEditor";
import { RawData } from "./RawData";
import { ToggleIconButton } from "../../common/ToggleIconButton";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import bs58 from "bs58";

export const Data: React.FC<{data: IInstructionData}> = ({
  data: { format, raw, isHex, borsh, bufferLayout },
}) => {
  const { isAnchor, update } = useInstruction();

  const toast = useToast();

  const tabStyle: TabProps = {
    mr: "1",
    fontWeight: "semibold",
    color: useColorModeValue("blackAlpha.600", "whiteAlpha.600"),
    borderWidth: "1px",
    borderColor: "transparent",
    _selected: {
      color: "chakra-body-text",
      background: useColorModeValue("main.200", "main.800"),
    },
    _hover: {
      borderColor: "chakra-border-color",
    },
  };

  const lockedIconColor = useColorModeValue("blackAlpha.500", "whiteAlpha.500");

  return (
    <>
      <Flex mt="2" mb="4" alignItems="center">
        <Heading mr="3" size="sm">
          Data
        </Heading>
        <Divider flex="1" />
      </Flex>

      <Tabs
        variant="unstyled"
        size="sm"
        isLazy
        colorScheme="main"
        index={format === "borsh" ? 0 : format === "bufferLayout" ? 1 : 2}
        onChange={(index) => {
          update((state) => {
            state.data.format =
              index === 0 ? "borsh" : index === 1 ? "bufferLayout" : "raw";
          });
        }}
      >
        <Box display="flex">
          <TabList>
            <Tab {...tabStyle} rounded="md">
              Borsh{" "}
              {isAnchor && <LockIcon ml="1" w="2.5" color={lockedIconColor} />}
            </Tab>
            <Tab {...tabStyle} rounded="md" isDisabled={isAnchor}>
              Buffer Layout
            </Tab>
            <Tab {...tabStyle} rounded="md" isDisabled={isAnchor}>
              Raw
            </Tab>
          </TabList>
          {
            format === "raw" ? <Box ml="auto">
              <ToggleIconButton
                ml="1"
                size="sm"
                label={isHex ? "Click to use encoded data" : "Click to use hex data"}
                icon={<Icon as={HiOutlineSwitchHorizontal} />}
                isDisabled={isAnchor}
                toggled={!isHex}
                onToggle={(toggled) => {
                  update((state) => {
                    if (isHex) {
                      state.data.raw = bs58.encode(Buffer.from(raw, 'hex'));
                      state.data.isHex = !isHex;
                    } else {
                      try {
                        state.data.raw = Buffer.from(bs58.decode(raw)).toString('hex');
                        state.data.isHex = !isHex;
                      } catch (e) {
                        // it is not a valid base58 string
                        toast({
                          title: "Invalid string",
                          description: "This is not a valid base58 encoded string.",
                          status: "error",
                          isClosable: true,
                          duration: 30_000,
                        });
                      }
                    }
                  });
                }}
              />
            </Box> : <></>
          }
        </Box>

        <TabPanels>
          <TabPanel p="0" pt="3">
            <DataEditor format="borsh" fields={borsh} />
          </TabPanel>
          <TabPanel p="0" pt="3">
            <DataEditor format="bufferLayout" fields={bufferLayout} />
          </TabPanel>
          <TabPanel p="0" pt="3">
            <RawData data={raw} isHex={isHex} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

