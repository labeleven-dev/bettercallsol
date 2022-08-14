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
import { useSessionStoreWithUndo } from "../../hooks/useSessionStore";
import { removeFrom } from "../../utils/sortable";
import { EditableName } from "../common/EditableName";
import { Numbering } from "../common/Numbering";
import { SortableItemContext } from "../common/Sortable";

export const InstructionHeader: React.FC<{ index: number }> = ({ index }) => {
  const { instruction, update, reset } = useInstruction();
  const { listeners, attributes } = useContext(SortableItemContext);

  const set = useSessionStoreWithUndo((state) => state.set);

  return (
    <Flex mb={instruction.expanded ? "4" : undefined} alignItems="center">
      <DragHandleIcon mr="2" {...attributes} {...listeners} />

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
          update((state) => {
            state.expanded = !state.expanded;
          });
        }}
      />

      <Numbering index={index} fontSize="md" mr="2" minW="30px" maxH="30px" />

      <Heading flex="1" size="md">
        <EditableName
          tooltip="Click to edit"
          tooltipProps={{ placement: "bottom-start" }}
          placeholder="Unnamed Instruction"
          previewProps={{ p: "3px 6px 3px 6px" }}
          inputProps={{ p: "3px 6px 3px 6px" }}
          value={instruction.name}
          onChange={(value) => {
            update((state) => {
              state.name = value;
            });
          }}
        />
      </Heading>

      <Tooltip label={instruction.disabled ? "Enable" : "Disable"}>
        <IconButton
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
            update((state) => {
              state.disabled = !state.disabled;
            });
          }}
        />
      </Tooltip>

      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<Icon as={FaEllipsisV} />}
          variant="ghost"
        />
        <MenuList zIndex="modal">
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
              set((state) => {
                removeFrom(state.transaction.instructions, instruction.id);
              });
            }}
          >
            Remove
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};
