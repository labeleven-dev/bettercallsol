import {
  AddIcon,
  DeleteIcon,
  SearchIcon,
  SettingsIcon,
} from "@chakra-ui/icons";
import {
  Button,
  HStack,
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Portal,
  Tag,
  Text,
  Wrap,
} from "@chakra-ui/react";
import { useAccount } from "hooks/useAccount";
import { useAccountType } from "hooks/useAccountType";
import React, { useRef, useState } from "react";

// TODO not sophisticated enough, we need to handle many types of numbers, basically Buffer.write*()

export const PdaTypeConfig: React.FC = () => {
  const [seed, setSeed] = useState("");
  const [error, setError] = useState("");
  const { update } = useAccount();
  const { metadata, populate } = useAccountType();
  const initialFocusRef = useRef(null);

  const seeds = metadata?.seeds || [];
  const bump = metadata?.bump;

  const add = () => {
    update((state) => {
      state.metadata = { seeds: [...seeds, seed] };
    });
    setSeed("");
  };

  const generate = (onClose: () => void) => () => {
    try {
      setError("");
      populate();
      onClose();
    } catch (e) {
      setError((e as Error).toString());
    }
  };

  return (
    <Popover placement="right" initialFocusRef={initialFocusRef} isLazy>
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            <Button size="xs" colorScheme="teal" rightIcon={<SettingsIcon />}>
              {`${seeds.length || 0} seeds`}
              {bump !== undefined && `, bump = ${bump}`}
            </Button>
          </PopoverTrigger>

          {/* avoid z-index issues with it rendering before other compoents that may clash with it */}
          <Portal>
            <PopoverContent>
              <PopoverArrow bg="chakra-body-bg" />

              <PopoverBody>
                <HStack spacing="1">
                  <Input
                    ref={initialFocusRef}
                    size="xs"
                    placeholder="String seed"
                    value={seed}
                    onChange={(e) => {
                      setSeed(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        add();
                      }
                    }}
                  />
                  <IconButton
                    size="xs"
                    aria-label="Confirm"
                    colorScheme="teal"
                    icon={<AddIcon />}
                    onClick={add}
                  />
                </HStack>

                <Wrap mt="3" spacing="1">
                  {seeds.map((seed, index) => (
                    <Tag colorScheme="blue" key={index} wordBreak="break-all">
                      {seed}
                      <IconButton
                        ml="1"
                        size="xs"
                        variant="ghost"
                        colorScheme="blue"
                        aria-label="Confirm"
                        icon={<DeleteIcon />}
                        onClick={() => {
                          update((state) => {
                            state.metadata = {
                              seeds: seeds.filter((_, i) => i !== index),
                            };
                          });
                        }}
                      />
                    </Tag>
                  ))}
                </Wrap>
              </PopoverBody>

              <PopoverFooter>
                <HStack>
                  <Button
                    size="xs"
                    leftIcon={<SearchIcon />}
                    onClick={generate(onClose)}
                  >
                    Find PDA
                  </Button>
                  {error && (
                    <Text ml="2" color="red.500" fontSize="sm">
                      {error}
                    </Text>
                  )}
                </HStack>
              </PopoverFooter>
            </PopoverContent>
          </Portal>
        </>
      )}
    </Popover>
  );
};
