import { Textarea } from "@chakra-ui/react";
import React from "react";
import { useInstruction } from "../../../hooks/useInstruction";

export const RawData: React.FC<{ data: string }> = ({ data }) => {
  const { update } = useInstruction();

  return (
    <Textarea
      flex="1"
      fontFamily="mono"
      placeholder="Instruction data"
      value={data}
      onChange={(e) => {
        update((state) => {
          state.data.raw = e.target.value;
        });
      }}
    />
  );
};
