import { DeleteIcon, SearchIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Button,
  HStack,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Portal,
  Text,
} from "@chakra-ui/react";
import { useAccount } from "hooks/useAccount";
import { useAccountType } from "hooks/useAccountType";
import React, { useRef, useState } from "react";

export const AtaTypeConfig: React.FC = () => {
  const { metadata, populate } = useAccountType();
  const [error, setError] = useState("");
  const { update } = useAccount();
  const initialFocusRef = useRef(null);

  const mint = metadata?.mint;

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
              {`Mint: ${mint || "Not set"}`}
            </Button>
          </PopoverTrigger>

          {/* avoid z-index issues with it rendering before other compoents that may clash with it */}
          <Portal>
            <PopoverContent>
              <PopoverArrow bg="chakra-body-bg" />

              <PopoverBody>
                <Input
                  ref={initialFocusRef}
                  size="xs"
                  placeholder="Mint address"
                  value={mint}
                  onChange={(e) => {
                    update((state) => {
                      state.metadata = { mint: e.target.value };
                    });
                  }}
                />
              </PopoverBody>

              <PopoverFooter>
                <HStack>
                  <Button
                    size="xs"
                    colorScheme="teal"
                    leftIcon={<SearchIcon />}
                    onClick={generate(onClose)}
                  >
                    Find ATA
                  </Button>
                  <Button
                    size="xs"
                    leftIcon={<DeleteIcon />}
                    onClick={() => {
                      update((state) => {
                        state.pubkey = "";
                        state.metadata = { mint: "" };
                      });
                      onClose();
                    }}
                  >
                    Clear
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
