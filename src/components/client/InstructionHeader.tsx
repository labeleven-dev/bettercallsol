import {
  ChevronDownIcon,
  ChevronRightIcon,
  DeleteIcon,
  DragHandleIcon,
} from "@chakra-ui/icons";
import {
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Heading,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Tooltip,
} from "@chakra-ui/react";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import React, { useContext } from "react";
import { FaEllipsisV, FaEraser, FaEye, FaEyeSlash } from "react-icons/fa";
import { instructionGetter, useTransactionStore } from "../../store";
import { emptyInstruction } from "../../web3";
import { InstructionContext } from "./Instructions";

export const InstructionHeader: React.FC<{
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap;
}> = ({ attributes, listeners }) => {
  const instructionId = useContext(InstructionContext);
  const getInstruction = instructionGetter(instructionId);
  const instruction = useTransactionStore(
    (state) => state.transaction.instructions[instructionId]
  );

  const set = useTransactionStore((state) => state.set);

  const clearInstruction = () => {
    set((state) => {
      state.transaction.instructions[instructionId] = {
        ...emptyInstruction(),
        id: instructionId,
      };
    });
  };

  const removeInstruction = () => {
    set((state) => {
      state.transaction.instructionOrder =
        state.transaction.instructionOrder.filter((x) => x !== instructionId);
      delete state.transaction.instructions[instructionId];
    });
  };

  return (
    <Flex>
      <DragHandleIcon mt="1.5" mr="2" {...attributes} {...listeners} />
      <IconButton
        h="8"
        w="8"
        mr="2"
        aria-label="Collapse"
        icon={
          instruction.expanded ? (
            <ChevronDownIcon h="6" w="6" />
          ) : (
            <ChevronRightIcon h="6" w="6" />
          )
        }
        variant="ghost"
        onClick={() => {
          set((state) => {
            getInstruction(state).expanded = !instruction.expanded;
          });
        }}
      />
      <Tooltip label="Click to edit" placement="top-start">
        <Editable
          mb="5"
          value={instruction.name}
          onChange={(value) => {
            set((state) => {
              getInstruction(state).name = value;
            });
          }}
        >
          <Heading size="md">
            <EditablePreview minW="100px" minH="23px" />
            <EditableInput />
          </Heading>
        </Editable>
      </Tooltip>
      <Spacer />
      <Tooltip label={instruction.disabled ? "Enable" : "Disable"}>
        <IconButton
          mt="-2"
          ml="2"
          aria-label={instruction.disabled ? "Enable" : "Disable"}
          variant="ghost"
          icon={
            instruction.disabled ? (
              <Icon as={FaEyeSlash} />
            ) : (
              <Icon as={FaEye} />
            )
          }
          onClick={() => {
            set((state) => {
              getInstruction(state).disabled = !instruction.disabled;
            });
          }}
        />
      </Tooltip>
      <Menu>
        <MenuButton
          mt="-2"
          as={IconButton}
          aria-label="Options"
          icon={<Icon as={FaEllipsisV} />}
          variant="ghost"
        />
        <MenuList>
          <MenuItem icon={<Icon as={FaEraser} />} onClick={clearInstruction}>
            Clear
          </MenuItem>
          <MenuItem icon={<DeleteIcon />} onClick={removeInstruction}>
            Remove
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};
