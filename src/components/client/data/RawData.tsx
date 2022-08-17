import { Textarea } from "@chakra-ui/react";
import React from "react";
import { useInstruction } from "../../../hooks/useInstruction";

export const RawData: React.FC<{data: string, isHex: boolean}> = ({ data, isHex }) => {
  const { update } = useInstruction();

  return (
    <Textarea
      flex="1"
      fontFamily="mono"
      placeholder={isHex ? "Instruction data (hex)" : "Instruction data (base58 encoded)"}
      value={data}
      onChange={(e) => {
        update((state) => {
          state.data.raw = e.target.value;
        });
      }}
    />
  );
};
