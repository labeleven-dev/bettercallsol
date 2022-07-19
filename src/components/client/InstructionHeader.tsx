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
  const instruction = useContext(InstructionContext);
  const uiState = useTransactionStore(
    (state) => state.uiState.instructions[instruction.id]
  );
  const set = useTransactionStore((state) => state.set);
  const removeInstruction = useTransactionStore(
    (state) => state.removeInstruction
  );

  const getInstruction = instructionGetter(instruction.id);

  const clearInstruction = () => {
    set((state) => {
      state.transaction.instructions.map[instruction.id] = {
        ...newInstruction(),
        id: instruction.id,
      };
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
            state.uiState.instructions[instruction.id].expanded =
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
              state.uiState.instructions[instruction.id].disabled =
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
          <MenuItem
            icon={<DeleteIcon />}
            onClick={() => {
              removeInstruction(instruction.id);
            }}
          >
            Remove
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};
