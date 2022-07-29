import {
  ChevronDownIcon,
  ChevronRightIcon,
  DeleteIcon,
  DragHandleIcon,
} from "@chakra-ui/icons";
import {
  Flex,
  Heading,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { FaEllipsisV, FaEraser, FaEye, FaEyeSlash } from "react-icons/fa";
import { useInstruction } from "../../hooks/useInstruction";
import { useTransactionStore } from "../../hooks/useTransactionStore";
import { EditableName } from "../common/EditableName";
import { Numbering } from "../common/Numbering";
import { SortableItemContext } from "../common/Sortable";

export const InstructionHeader: React.FC<{ index: number }> = ({ index }) => {
  const { instruction, uiState, update, updateUi, reset } = useInstruction();
  const { listeners, attributes } = useContext(SortableItemContext);

  const removeInstruction = useTransactionStore(
    (state) => state.removeInstruction
  );

  return (
    <Flex h={!uiState.expanded ? "30px" : undefined}>
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
          updateUi((state) => {
            state.expanded = !uiState.expanded;
          });
        }}
      />

      <Numbering
        index={index}
        pt="1"
        fontSize="md"
        mr="2"
        minW="30px"
        maxH="30px"
      />

      <Heading flex="1" size="md">
        <EditableName
          mb="5"
          tooltip="Click to edit"
          placeholder="Unnamed Instruction"
          value={instruction.name}
          onChange={(value) => {
            update((state) => {
              state.name = value;
            });
          }}
        />
      </Heading>

      <Tooltip label={uiState.disabled ? "Enable" : "Disable"}>
        <IconButton
          mt="-2"
          ml="2"
          aria-label={uiState.disabled ? "Enable" : "Disable"}
          variant="ghost"
          icon={
            uiState.disabled ? <Icon as={FaEyeSlash} /> : <Icon as={FaEye} />
          }
          onClick={() => {
            updateUi((state) => {
              state.disabled = !uiState.disabled;
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
          <MenuItem
            icon={<Icon as={FaEraser} />}
            onClick={() => {
              reset();
            }}
          >
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
