import {
  ChevronDownIcon,
  ChevronRightIcon,
  DeleteIcon,
  DragHandleIcon,
} from "@chakra-ui/icons";
import {
  Collapse,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Grid,
  Heading,
  Icon,
  IconButton,
  Input,
  Spacer,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { instructionGetter, useTransactionStore } from "../../store";
import { Accounts } from "./Accounts";
import { Data } from "./Data";
import { InstructionContext } from "./Instructions";

export const Instruction: React.FC = () => {
  const instructionId = useContext(InstructionContext);
  const getInstruction = instructionGetter(instructionId);
  const instruction = useTransactionStore(
    (state) => state.transaction.instructions[instructionId]
  );

  const set = useTransactionStore((state) => state.set);

  // TODO find a clean way to abstract this away into their own SortableItem
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: instructionId,
      animateLayoutChanges: (args) =>
        defaultAnimateLayoutChanges({ ...args, wasDragging: true }),
    });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const removeInstruction = () => {
    set((state) => {
      state.transaction.instructionOrder =
        state.transaction.instructionOrder.filter((x) => x !== instructionId);
      delete state.transaction.instructions[instructionId];
    });
  };

  return (
    <Grid
      ref={setNodeRef}
      style={style}
      mb="2"
      p="5"
      border="1px"
      rounded="md"
      borderColor={useColorModeValue("gray.200", "gray.600")}
      bg={useColorModeValue("", "whiteAlpha.50")}
      boxShadow={useColorModeValue("base", "")}
    >
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
              <EditablePreview minW="20px" />
              <EditableInput />
            </Heading>
          </Editable>
        </Tooltip>
        <Spacer />
        <Tooltip label={instruction.disabled ? "Enable" : "Disable"}>
          <IconButton
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
        <Tooltip label="Remove">
          <IconButton
            ml="2"
            aria-label="Remove"
            icon={<DeleteIcon />}
            variant="ghost"
            onClick={removeInstruction}
          />
        </Tooltip>
      </Flex>
      <Collapse in={instruction.expanded}>
        <Input
          mb="5"
          placeholder="Program ID"
          value={instruction.programId}
          onChange={(e) => {
            set((state) => {
              getInstruction(state).programId = e.target.value;
            });
          }}
        />
        <Accounts />
        <Data />
      </Collapse>
    </Grid>
  );
};
