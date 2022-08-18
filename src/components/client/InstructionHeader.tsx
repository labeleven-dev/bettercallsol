import {
  ChevronDownIcon,
  ChevronRightIcon,
  DeleteIcon,
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
import { arrayMove } from "@dnd-kit/sortable";
import React from "react";
import {
  FaAngleDoubleDown,
  FaAngleDoubleUp,
  FaEllipsisV,
  FaEraser,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useInstruction } from "../../hooks/useInstruction";
import { useSessionStoreWithUndo } from "../../hooks/useSessionStore";
import { removeFrom } from "../../utils/sortable";
import { DragHandle } from "../common/DragHandle";
import { EditableName } from "../common/EditableName";
import { Numbering } from "../common/Numbering";

export const InstructionHeader: React.FC<{ index: number }> = ({ index }) => {
  const { instruction, update, reset } = useInstruction();

  const [instructionOrder, set] = useSessionStoreWithUndo((state) => [
    state.transaction.instructions.order,
    state.set,
  ]);

  return (
    <Flex mb={instruction.expanded ? "4" : undefined} alignItems="center">
      <DragHandle unlockedProps={{ mr: "2" }} />

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
            icon={<Icon as={FaAngleDoubleUp} />}
            isDisabled={index === 0}
            onClick={() => {
              set((state) => {
                state.transaction.instructions.order = arrayMove(
                  state.transaction.instructions.order,
                  index,
                  0
                );
              });
            }}
          >
            Move to the top
          </MenuItem>
          <MenuItem
            icon={<Icon as={FaAngleDoubleDown} />}
            isDisabled={index === instructionOrder.length - 1}
            onClick={() => {
              set((state) => {
                state.transaction.instructions.order = arrayMove(
                  state.transaction.instructions.order,
                  index,
                  instructionOrder.length - 1
                );
              });
            }}
          >
            Move to the bottom
          </MenuItem>
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
