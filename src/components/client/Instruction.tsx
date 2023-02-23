import { WarningTwoIcon } from "@chakra-ui/icons";
import {
  Box,
  Collapse,
  Flex,
  FormLabel,
  Grid,
  Icon,
  IconButton,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Portal,
  Tag,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { Accounts } from "components/client/accounts/Accounts";
import { Data } from "components/client/data/Data";
import { InstructionHeader } from "components/client/InstructionHeader";
import { AccountAutoComplete } from "components/common/AccountAutoComplete";
import { Description } from "components/common/Description";
import { ExplorerButton } from "components/common/ExplorerButton";
import { useInstruction } from "hooks/useInstruction";
import { useSessionStoreWithUndo } from "hooks/useSessionStore";
import { useWeb3Account } from "hooks/useWeb3Account";
import { mapIdlInstructionToIInstructionPreview } from "mappers/idl-to-preview";
import {
  detectAnchorMethod,
  ejectFromAnchor,
  tryMapToAnchor,
} from "mappers/internal";
import { mapIInstructionPreviewToIInstruction } from "mappers/preview-to-internal";
import React, { useMemo } from "react";
import { FaAnchor, FaEject, FaExchangeAlt, FaRocket } from "react-icons/fa";
import { DEFAULT_ERROR_MODAL } from "utils/ui-constants";

export const Instruction: React.FC<{ index: number }> = ({ index }) => {
  const rpcEndpoint = useSessionStoreWithUndo((state) => state.rpcEndpoint);
  const { id, isAnchor, useGet, update, set } = useInstruction();
  const instruction = useGet((state) => state);
  const { programId, description, anchorMethod, data, disabled, expanded } =
    instruction;
  const programInfo = useWeb3Account(programId);
  const toast = useToast();

  const possibleAnchorMethod = useMemo(
    () =>
      !isAnchor && programInfo.idl
        ? detectAnchorMethod(data, programInfo.idl)
        : null,
    [isAnchor, programInfo.idl, data]
  );

  const convertToEmptyAnchor = (ixnName: string) => {
    const newInstruction = mapIInstructionPreviewToIInstruction(
      mapIdlInstructionToIInstructionPreview(
        programInfo.idl?.instructions.find(({ name }) => name === ixnName)!, // the name comes from Idl so it will never be undefined
        programId
      ),
      "anchorProgramId"
    );
    set(newInstruction);
  };

  const mapToDetectedAnchor = () => {
    try {
      const mapped = tryMapToAnchor(
        instruction,
        possibleAnchorMethod!, // the button won't be there if this is undefined
        programInfo.idl! // the button won't be there if this is undefined
      );
      set(mapped);
    } catch (e: unknown) {
      toast({
        ...DEFAULT_ERROR_MODAL,
        title: "Cannot map instruction to Anchor",
        description: (e as Error).message,
      });
    }
  };

  const ejectAnchor = () => {
    set(ejectFromAnchor(instruction));
  };

  return (
    <Grid
      mb="5"
      p="5"
      border="1px"
      rounded="md"
      borderColor="chakra-body-bg"
      bg={
        disabled
          ? "repeating-linear-gradient(-45deg, transparent, transparent 40px, #85858510 40px, #85858510 80px)"
          : ""
      }
      boxShadow={disabled ? "0 0 8px 1px gray" : "0 0 8px 1px #9945FF"}
    >
      <InstructionHeader index={index} />

      <Collapse in={expanded}>
        <Description
          mb="2"
          fontSize="sm"
          description={description}
          setDescription={(description) => {
            update((state) => {
              state.description = description;
            });
          }}
        />

        <Flex alignItems="center" mb="1">
          <FormLabel mb="0" htmlFor="program-id">
            Program
          </FormLabel>
          <InputGroup>
            {programInfo.status === "fetched" && (
              <InputLeftElement pointerEvents="none">
                {isAnchor ? (
                  <Tooltip label="Anchor program">
                    {/* Box is needed coz react-icons do not support forwardref 
                      https://github.com/chakra-ui/chakra-ui/issues/683
                  */}
                    <Box>
                      <Icon as={FaAnchor} />
                    </Box>
                  </Tooltip>
                ) : programInfo.executable ? (
                  <Tooltip label="Executable program">
                    <Box>
                      <Icon mt="2" as={FaRocket} />
                    </Box>
                  </Tooltip>
                ) : (
                  <Tooltip label="Not a program">
                    <WarningTwoIcon />
                  </Tooltip>
                )}
              </InputLeftElement>
            )}

            <AccountAutoComplete
              chakraInputProps={{
                id: "program-id",
                placeholder: "Start typing...",
                paddingStart: "10",
                autoFocus: true,
              }}
              types={["input", "program", "instruction"]}
              pubkey={programId}
              updateInstructionWithId={id}
              setPubkey={(pubkey) => {
                update((state) => {
                  state.programId = pubkey.trim();
                });
              }}
            />

            <InputRightElement
              // chakra hardcode the width so we can't have multiple buttons
              w=""
              mr="1"
            >
              {programInfo.idl && (
                <Menu>
                  <Tooltip label="Switch to an empty Anchor instruction">
                    <MenuButton
                      as={IconButton}
                      size="sm"
                      variant="ghost"
                      aria-label="Choose Anchor method"
                      icon={<Icon as={FaAnchor} />}
                    />
                  </Tooltip>
                  <Portal>
                    <MenuList
                      h={80}
                      sx={{ overflow: "scroll" }}
                      fontSize="sm"
                      // avoid z-index issues with it rendering before other compoents that may clash with it
                      zIndex="modal"
                    >
                      <MenuGroup title="Instructions">
                        {programInfo.idl.instructions.map(({ name }, index) => (
                          <MenuItem
                            key={index}
                            fontFamily="mono"
                            onClick={() => {
                              convertToEmptyAnchor(name);
                            }}
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </MenuGroup>
                    </MenuList>
                  </Portal>
                </Menu>
              )}

              <ExplorerButton
                size="sm"
                variant="button"
                valueType="account"
                value={programId}
                rpcEndpoint={rpcEndpoint}
              />
            </InputRightElement>
          </InputGroup>
        </Flex>

        <Flex ml="70px" mb="4">
          {programInfo.label && <Tag size="sm">{programInfo.label}</Tag>}
          {anchorMethod && (
            <Tag size="sm">
              Anchor Method:
              <Text fontFamily="mono" ml="1">
                {anchorMethod}
              </Text>
              <Tooltip label="Eject from Anchor">
                <IconButton
                  ml="1"
                  size="xs"
                  variant="ghost"
                  aria-label="Convert to Anchor"
                  icon={<Icon as={FaEject} />}
                  onClick={ejectAnchor}
                />
              </Tooltip>
            </Tag>
          )}
          {possibleAnchorMethod && (
            <Tag size="sm" colorScheme="yellow" variant="outline">
              Anchor Method Detected:
              <Text fontFamily="mono" ml="1">
                {possibleAnchorMethod}
              </Text>
              <Tooltip label="Convert to Anchor">
                <IconButton
                  ml="1"
                  size="xs"
                  variant="ghost"
                  colorScheme="yellow"
                  aria-label="Convert to Anchor"
                  icon={<Icon as={FaExchangeAlt} />}
                  onClick={mapToDetectedAnchor}
                />
              </Tooltip>
            </Tag>
          )}
        </Flex>

        <Accounts />

        <Data />
      </Collapse>
    </Grid>
  );
};
