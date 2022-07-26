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
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { FaEllipsisV, FaEraser, FaEye, FaEyeSlash } from "react-icons/fa";
import { useInstruction } from "../../hooks/useInstruction";
import { useTransactionStore } from "../../hooks/useTransactionStore";
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
      <Heading
        mt="0.5"
        size="md"
        mr="2"
        textColor={useColorModeValue("blackAlpha.500", "whiteAlpha.500")}
      >
        #{index + 1}
      </Heading>
      <Tooltip label="Click to edit" placement="top-start">
        <Editable
          mb="5"
          value={instruction.name}
          onChange={(value) => {
            update((state) => {
              state.name = value;
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
