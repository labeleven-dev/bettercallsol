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
import { DragHandle } from "components/common/DragHandle";
import { EditableName } from "components/common/EditableName";
import { Numbering } from "components/common/Numbering";
import { useInstruction } from "hooks/useInstruction";
import { useShallowSessionStoreWithUndo } from "hooks/useSessionStore";
import { ejectFromAnchor } from "mappers/internal";
import React from "react";
import {
  FaAngleDoubleDown,
  FaAngleDoubleUp,
  FaEject,
  FaEllipsisV,
  FaEraser,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { removeFrom } from "utils/sortable";

export const InstructionHeader: React.FC<{ index: number }> = ({ index }) => {
  const { id, isAnchor, useShallowGet, update, reset } = useInstruction();
  const [expanded, name, disabled] = useShallowGet((state) => [
    state.expanded,
    state.name,
    state.disabled,
  ]);

  const [instructionOrder, set] = useShallowSessionStoreWithUndo((state) => [
    state.transaction.instructions.order,
    state.set,
  ]);

  return (
    <Flex mb={expanded ? "4" : undefined} alignItems="center">
      <DragHandle unlockedProps={{ mr: "2" }} />

      <IconButton
        h="8"
        w="8"
        mr="2"
        aria-label="Collapse"
        icon={
          expanded ? (
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
          value={name}
          onChange={(value) => {
            update((state) => {
              state.name = value;
            });
          }}
        />
      </Heading>

      <Tooltip label={disabled ? "Enable" : "Disable"}>
        <IconButton
          aria-label={disabled ? "Enable" : "Disable"}
          variant="ghost"
          icon={disabled ? <Icon as={FaEyeSlash} /> : <Icon as={FaEye} />}
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
        <MenuList zIndex="modal" fontSize="md">
          {isAnchor && (
            <MenuItem
              icon={<Icon as={FaEject} />}
              onClick={() => {
                set((state) => {
                  state.transaction.instructions.map[id] = ejectFromAnchor(
                    state.transaction.instructions.map[id]
                  );
                });
              }}
            >
              Eject from Anchor
            </MenuItem>
          )}

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
                removeFrom(state.transaction.instructions, id);
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
