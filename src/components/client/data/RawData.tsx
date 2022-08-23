import {
  Flex,
  Grid,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import bs58 from "bs58";
import React from "react";
import { useInstruction } from "../../../hooks/useInstruction";

export const RawData: React.FC = () => {
  const { useShallowGet, update } = useInstruction();
  const [encoding, content] = useShallowGet((state) => [
    state.data.raw.encoding,
    state.data.raw.content,
  ]);

  const toast = useToast();

  const onChange = (encoding: string) => {
    if (encoding === "bs58") {
      const encoded = bs58.encode(Buffer.from(content, "hex"));

      if (content.length !== 0 && encoded.length === 0) {
        toast({
          title: "Invalid raw data",
          description: "This is not a valid hexadecimal string.",
          status: "error",
          isClosable: true,
        });
        return;
      }

      update((state) => {
        state.data.raw.content = encoded;
        state.data.raw.encoding = "bs58";
      });
    }

    if (encoding === "hex") {
      try {
        const encoded = Buffer.from(bs58.decode(content)).toString("hex");
        update((state) => {
          state.data.raw.content = encoded;
          state.data.raw.encoding = "hex";
        });
      } catch (e) {
        toast({
          title: "Invalid raw data",
          description: "This is not a valid base 58-encoded string.",
          status: "error",
          isClosable: true,
        });
        return;
      }
    }
  };

  return (
    <Grid>
      <Flex>
        <Spacer />
        <RadioGroup
          size="sm"
          mb="1"
          mr="2"
          value={encoding}
          onChange={onChange}
        >
          <Stack direction="row">
            <Radio value="bs58">Base 58</Radio>
            <Radio value="hex">Hex</Radio>
          </Stack>
        </RadioGroup>
      </Flex>

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
    </Grid>
  );
};
