import { AddIcon } from "@chakra-ui/icons";
import {
  Center,
  Grid,
  IconButton,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { useSessionStoreWithUndo } from "../../hooks/useSessionStore";
import { IInstruction } from "../../types/internal";
import { IID, SortableCollection } from "../../types/sortable";
import { newInstruction } from "../../utils/internal";
import { addTo, toSortedArray } from "../../utils/sortable";
import { Sortable } from "../common/Sortable";
import { Instruction } from "./Instruction";

export const InstructionContext = React.createContext(newInstruction());

export const Instructions: React.FC<{
  instructions: SortableCollection<IInstruction>;
}> = ({ instructions }) => {
  const set = useSessionStoreWithUndo((state) => state.set);

  const setOrderItem = (itemOrders: IID[]) => {
    set((state) => {
      state.transaction.instructions.order = itemOrders;
    });
  };

  const emptyBgColour = useColorModeValue("blackAlpha.50", "whiteAlpha.50");

  return (
    <Grid>
      {instructions.order.length === 0 && (
        <Center p="6" m="1" bgColor={emptyBgColour} rounded="md">
          <Text as="i" textColor="grey">
            No instructions yet. Click on <AddIcon ml="0.5" mr="0.5" w="2.5" />{" "}
            below to add one.
          </Text>
        </Center>
      )}

      <Sortable itemOrder={instructions.order} setItemOrder={setOrderItem}>
        {toSortedArray(instructions).map((instruction, index) => (
          // key must be stable so it can't be loop index
          <InstructionContext.Provider value={instruction} key={instruction.id}>
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
              addTo(state.transaction.instructions, newInstruction());
            });
          }}
        />
      </Tooltip>
    </Grid>
  );
};
