import { CheckCircleIcon, WarningIcon, WarningTwoIcon } from "@chakra-ui/icons";
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
  Link,
  Tag,
  Tooltip,
  useColorModeValue,
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
import React from "react";
import { FaAnchor, FaRocket } from "react-icons/fa";

export const Instruction: React.FC<{ index: number }> = ({ index }) => {
  const rpcEndpoint = useSessionStoreWithUndo((state) => state.rpcEndpoint);
  const { useShallowGet, update } = useInstruction();
  const [programId, description, anchorMethod, disabled, expanded] =
    useShallowGet((state) => [
      state.programId,
      state.description,
      state.anchorMethod,
      state.disabled,
      state.expanded,
    ]);
  const programInfo = useWeb3Account(programId);

  return (
    <Grid
      mb="2"
      px="5"
      py="3"
      border="1px"
      rounded="md"
      borderColor={useColorModeValue("gray.200", "gray.600")}
      bg={
        disabled
          ? "repeating-linear-gradient(-45deg, transparent, transparent 40px, #85858510 40px, #85858510 80px)"
          : ""
      }
      bgColor={useColorModeValue("", "whiteAlpha.50")}
      boxShadow={useColorModeValue("base", "")}
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
                {programInfo.hasIdl ? (
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
                placeholder: "Program ID",
                paddingStart: "10",
                autoFocus: true,
              }}
              types={["program"]}
              pubkey={programId}
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
              {programInfo.status === "fetched" &&
                programInfo.aprVerified !== null && (
                  <Tooltip
                    label={`${
                      programInfo.aprVerified ? "Verified" : "Unverified"
                    } Build (Open in apr.dev)`}
                  >
                    <Link
                      href={`https://www.apr.dev/program/${programId}`}
                      isExternal
                    >
                      <IconButton
                        aria-label={`${
                          programInfo.aprVerified ? "Verified" : "Unverified"
                        } Build (Open in apr.dev)`}
                        variant="ghost"
                        size="sm"
                        icon={
                          programInfo.aprVerified ? (
                            <CheckCircleIcon color="green.400" />
                          ) : (
                            <WarningIcon color="yellow.400" />
                          )
                        }
                      />
                    </Link>
                  </Tooltip>
                )}
              <ExplorerButton
                size="sm"
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
            <Tag size="sm">{`Anchor Method: ${anchorMethod}`}</Tag>
          )}
        </Flex>

        <Accounts />

        <Data />
      </Collapse>
    </Grid>
  );
};
