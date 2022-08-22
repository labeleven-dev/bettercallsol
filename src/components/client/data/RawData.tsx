import { Box, Icon, Textarea, useToast } from "@chakra-ui/react";
import bs58 from "bs58";
import React from "react";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { useInstruction } from "../../../hooks/useInstruction";
import { ToggleIconButton } from "../../common/ToggleIconButton";

export const RawData: React.FC = () => {
  const { useShallowGet, update } = useInstruction();
  const [encoding, content] = useShallowGet((state) => [
    state.data.raw.encoding,
    state.data.raw.content,
  ]);

  const toast = useToast();

  const onToggle = () => {
    update((state) => {
      if (encoding === "hex") {
        state.data.raw.content = bs58.encode(Buffer.from(content, "hex"));
        state.data.raw.encoding = "bs58";
      } else {
        try {
          state.data.raw.content = Buffer.from(
            bs58.decode(state.data.raw.content)
          ).toString("hex");
          state.data.raw.encoding = "hex";
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
  };

  return (
    <Box display="flex">
      <Textarea
        flex="1"
        fontFamily="mono"
        placeholder={
          encoding === "hex"
            ? "Instruction data (hex)"
            : "Instruction data (base58 encoded)"
        }
        value={content}
        onChange={(e) => {
          update((state) => {
            state.data.raw.content = e.target.value;
          });
        }}
      />

      <Box ml="auto" mt="auto">
        <ToggleIconButton
          ml="1"
          size="sm"
          label={
            encoding === "hex"
              ? "Click to use encoded data"
              : "Click to use hex data"
          }
          icon={<Icon as={HiOutlineSwitchHorizontal} />}
          toggled={encoding !== "hex"}
          onToggle={onToggle}
        />
      </Box>
    </Box>
  );
};
