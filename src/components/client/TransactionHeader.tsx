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
import React from "react";
import {
  FaEllipsisV,
  FaEraser,
  FaExpand,
  FaExpandAlt,
  FaFileExport,
  FaFolderOpen,
  FaPlay,
} from "react-icons/fa";
import { useTransaction } from "../../hooks/useTransaction";
import { useTransactionStore } from "../../hooks/useTransactionStore";
import { NetworkSelector } from "./NetworkSelector";

export const TransactionHeader: React.FC = () => {
  const transactionData = useTransactionStore((state) => state.transaction);
  const results = useTransactionStore((state) => state.results);
  const set = useTransactionStore((state) => state.set);

  const transact = useTransaction();

  return (
    <Flex mb="5">
      <Tooltip label="Click to edit" placement="top-start">
        <Editable
          defaultValue={transactionData.name}
          onChange={(value) =>
            set((state) => {
              state.transaction.name = value;
            })
          }
        >
          <Heading size="md">
            <EditablePreview minW="100px" minH="23px" />
            <EditableInput />
          </Heading>
        </Editable>
      </Tooltip>
      <Spacer />
      <Tooltip label="Expand All">
        <IconButton
          ml="2"
          aria-label="Expand All"
          icon={<Icon as={FaExpandAlt} />}
          variant="ghost"
          onClick={() => {
            set((state) => {
              Object.keys(state.transaction.instructions).forEach((id) => {
                state.transaction.instructions[id].expanded = true;
              });
            });
          }}
        />
      </Tooltip>
      <Tooltip label="Collapse All">
        <IconButton
          aria-label="Collapse All"
          icon={<Icon as={FaExpand} />}
          variant="ghost"
          onClick={() => {
            set((state) => {
              Object.keys(state.transaction.instructions).forEach((id) => {
                state.transaction.instructions[id].expanded = false;
              });
            });
          }}
        />
      </Tooltip>
      <Menu>
        <MenuButton
          mr="2"
          as={IconButton}
          aria-label="Options"
          icon={<Icon as={FaEllipsisV} />}
          variant="ghost"
        />
        <MenuList>
          {/* TODO implement */}
          <MenuItem icon={<Icon as={FaFolderOpen} />} isDisabled>
            Import
          </MenuItem>
          {/* TODO implement */}
          <MenuItem icon={<Icon as={FaFileExport} />} isDisabled>
            Export
          </MenuItem>
          <MenuItem icon={<Icon as={FaEraser} />}>Clear</MenuItem>
        </MenuList>
      </Menu>
      <NetworkSelector />
      <Tooltip label="Run Program">
        <IconButton
          isLoading={results.inProgress}
          ml="2"
          mr="2"
          colorScheme="main"
          color="main.500"
          borderWidth="2px"
          variant="outline"
          aria-label="Run Program"
          icon={<Icon as={FaPlay} />}
          onClick={transact}
        />
      </Tooltip>
    </Flex>
  );
};
