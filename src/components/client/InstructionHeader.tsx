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
import { useTransactionStore } from "../../hooks/useTransactionStore";
import { instructionGetter } from "../../models/state";
import { newInstruction } from "../../models/web3";
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
  const uiState = useTransactionStore(
    (state) => state.uiState.instructions[instructionId]
  );
  const set = useTransactionStore((state) => state.set);

  const clearInstruction = () => {
    set((state) => {
      state.transaction.instructions[instructionId] = {
        ...newInstruction(),
        id: instructionId,
      };
    });
  };

  const removeInstruction = () => {
    set((state) => {
      state.transaction.instructionOrder =
        state.transaction.instructionOrder.filter((x) => x !== instructionId);
      delete state.transaction.instructions[instructionId];
      delete state.uiState.instructions[instructionId];
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
          uiState.expanded ? (
            <ChevronDownIcon h="6" w="6" />
          ) : (
            <ChevronRightIcon h="6" w="6" />
          )
        }
        variant="ghost"
        onClick={() => {
          set((state) => {
            state.uiState.instructions[instructionId].expanded =
              !uiState.expanded;
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
      <Tooltip label={uiState.disabled ? "Enable" : "Disable"}>
        <IconButton
          mt="-2"
          ml="2"
          aria-label={uiState.disabled ? "Enable" : "Disable"}
          variant="ghost"
          icon={
            uiState.disabled ? <Icon as={FaEye} /> : <Icon as={FaEyeSlash} />
          }
          onClick={() => {
            set((state) => {
              state.uiState.instructions[instructionId].disabled =
                !uiState.disabled;
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
