import { AddIcon } from "@chakra-ui/icons";
import {
  Center,
  Grid,
  IconButton,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { Instruction } from "components/client/Instruction";
import { Sortable } from "components/common/Sortable";
import { useShallowSessionStoreWithUndo } from "hooks/useSessionStore";
import React from "react";
import { IID } from "types/sortable";
import { newInstruction } from "utils/internal";
import { appendTo } from "utils/sortable";

export const InstructionContext = React.createContext("");

export const Instructions: React.FC = () => {
  const [instructionOrder, set] = useShallowSessionStoreWithUndo((state) => [
    state.transaction.instructions.order,
    state.set,
  ]);

  const setOrderItem = (itemOrders: IID[]) => {
    set((state) => {
      state.transaction.instructions.order = itemOrders;
    });
  };

  const emptyBgColour = useColorModeValue("blackAlpha.50", "whiteAlpha.50");

  return (
    <Grid>
      {instructionOrder.length === 0 && (
        <Center p="6" m="1" bgColor={emptyBgColour} rounded="md">
          <Text as="i" textColor="grey">
            No instructions yet. Click on <AddIcon ml="0.5" mr="0.5" w="2.5" />{" "}
            below to add one.
          </Text>
        </Center>
      )}

      <Sortable itemOrder={instructionOrder} setItemOrder={setOrderItem}>
        {instructionOrder.map((id, index) => (
          // key must be stable so it can't be loop index
          <InstructionContext.Provider value={id} key={id}>
            <Instruction index={index} />
          </InstructionContext.Provider>
        ))}
      </Sortable>

      <Tooltip label="Add Instruction">
        <IconButton
          aria-label="Add Instruction"
          icon={<AddIcon />}
          variant="ghost"
          onClick={() => {
            set((state) => {
              appendTo(state.transaction.instructions, newInstruction());
            });
          }}
        />
      </Tooltip>
    </Grid>
  );
};
