import { Flex, Heading, Select, Textarea } from "@chakra-ui/react";
import React, { useContext } from "react";
import { useTransactionStore } from "../../hooks/useTransactionStore";
import { instructionGetter } from "../../models/state";
import { InstructionContext } from "./Instructions";

export const Data: React.FC = () => {
  const instructionId = useContext(InstructionContext);
  const getInstruction = instructionGetter(instructionId);

  const { data } = useTransactionStore(getInstruction);

  const set = useTransactionStore((state) => state.set);

  return (
    <>
      <Heading mt="5" mb="3" size="sm">
        Data
      </Heading>
      <Flex>
        <Select mr="2" w="100px" variant="unstyled" defaultValue="text">
          <option value="text">Text</option>
        </Select>
        <Textarea
          flex="1"
          fontFamily="mono"
          placeholder="Instruction data"
          value={data}
          onChange={(e) => {
            set((state) => {
              getInstruction(state).data = e.target.value;
            });
          }}
        />
      </Flex>
    </>
  );
};
