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
import { Description } from "components/common/Description";
import { useInstruction } from "hooks/useInstruction";
import React from "react";
import { RawEncoding } from "types/internal";

export const RawData: React.FC = () => {
  const { useShallowGet, update } = useInstruction();
  const [encoding, content, description] = useShallowGet((state) => [
    state.data.raw.encoding,
    state.data.raw.content,
    state.data.raw.description,
  ]);

  const toast = useToast();

  const onChange = (targetEncoding: RawEncoding) => {
    try {
      let encoded: string;
      if (encoding === "hex") {
        const buffer = Buffer.from(content, "hex");
        if (targetEncoding === "bs58") {
          encoded = bs58.encode(buffer);
          if (content.length !== 0 && encoded.length === 0) {
            throw new Error("Invalid bs58 string");
          }
        } else if (targetEncoding === "utf8") {
          encoded = buffer.toString("utf-8");
        }
      } else if (encoding === "bs58") {
        const buffer = Buffer.from(bs58.decode(content));
        encoded = buffer.toString(targetEncoding as BufferEncoding);
      } else if (encoding === "utf8") {
        const buffer = Buffer.from(content, "utf-8");
        if (targetEncoding === "hex") {
          encoded = buffer.toString("hex");
        } else if (targetEncoding === "bs58") {
          encoded = bs58.encode(buffer);
        }
      }

      update((state) => {
        state.data.raw.content = encoded;
        state.data.raw.encoding = targetEncoding;
      });
    } catch (e) {
      toast({
        title: "Invalid raw data",
        description: `This is not a valid ${targetEncoding} string.`,
        status: "error",
        isClosable: true,
      });
      return;
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
            <Radio value="utf8">UTF-8</Radio>
          </Stack>
        </RadioGroup>
      </Flex>

      <Textarea
        flex="1"
        fontFamily="mono"
        placeholder="Instruction data"
        value={content}
        onChange={(e) => {
          update((state) => {
            state.data.raw.content = e.target.value;
          });
        }}
      />

      <Description
        mt="1"
        fontSize="sm"
        description={description}
        setDescription={(description) => {
          update((state) => {
            state.description = description;
          });
        }}
      />
    </Grid>
  );
};
