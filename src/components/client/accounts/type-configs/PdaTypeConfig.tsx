import { AddIcon, DeleteIcon, SettingsIcon } from "@chakra-ui/icons";
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
  Wrap,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { useAccount } from "../../../../hooks/useAccount";
import { useAccountType } from "../../../../hooks/useAccountType";
import { IAccountTypeConfigPda } from "../../../../types/internal";

// TODO not sophisticated enough, we need to handle many types of numbers, basically Buffer.write*()

export const PdaTypeConfig: React.FC<{
  config: IAccountTypeConfigPda;
}> = ({ config: { seeds, bump } }) => {
  const [seed, setSeed] = useState("");

  const { update } = useAccount();
  const { populate } = useAccountType();

  const initialFocusRef = useRef(null);

  const add = () => {
    update((state) => {
      state.type.config = { seeds: [...seeds, seed] };
    });
    setSeed("");
  };

  return (
    <Popover
      placement="right"
      closeOnBlur={false}
      initialFocusRef={initialFocusRef}
      isLazy
    >
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
              <PopoverArrow />

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
                    icon={<AddIcon />}
                    onClick={add}
                  />
                </HStack>

                <Wrap mt="3" spacing="1">
                  {seeds.map((seed, index) => (
                    <Tag colorScheme="blue" noOfLines={1} key={index}>
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
                            state.type.config = {
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
                    colorScheme="teal"
                    size="xs"
                    onClick={() => {
                      populate();
                      onClose();
                    }}
                  >
                    Done
                  </Button>
                </HStack>
              </PopoverFooter>
            </PopoverContent>
          </Portal>
        </>
      )}
    </Popover>
  );
};
