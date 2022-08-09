import { CheckCircleIcon, WarningIcon, WarningTwoIcon } from "@chakra-ui/icons";
import {
  Box,
  Collapse,
  Grid,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { FaAnchor, FaRocket } from "react-icons/fa";
import { useInstruction } from "../../hooks/useInstruction";
import { useSessionStoreWithUndo } from "../../hooks/useSessionStore";
import { useWeb3Account } from "../../hooks/useWeb3Account";
import { ExplorerButton } from "../common/ExplorerButton";
import { Accounts } from "./accounts/Accounts";
import { Data } from "./data/Data";
import { InstructionHeader } from "./InstructionHeader";

export const Instruction: React.FC<{ index: number }> = ({ index }) => {
  const rpcEndpoint = useSessionStoreWithUndo((state) => state.rpcEndpoint);
  const {
    instruction: { programId, accounts, data, disabled, expanded },
    update,
  } = useInstruction();
  const programInfo = useWeb3Account(programId);

  return (
    <Grid
      mb="2"
      p="5"
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
        <InputGroup>
          {programInfo.status === "fetched" && (
            <InputLeftElement>
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
                    <Icon as={FaRocket} />
                  </Box>
                </Tooltip>
              ) : (
                <Tooltip label="Not a program">
                  <WarningTwoIcon />
                </Tooltip>
              )}
            </InputLeftElement>
          )}
          <Input
            mb="5"
            fontFamily="mono"
            placeholder="Program ID"
            value={programId}
            onChange={(e) => {
              update((state) => {
                state.programId = e.target.value.trim();
              });
            }}
          />
          <InputRightElement
            // chakra hardcode the width so we can't have multiple buttons
            w=""
            mr="1"
            // bug where it's set to 2 and goes in front of network selector menu :(
            // downside is that it is not clickable when the text field is active
            zIndex="base"
          >
            {programInfo.status === "fetched" && programInfo.verified !== null && (
              <Tooltip
                label={`${
                  programInfo.verified ? "Verified" : "Unverified"
                } Build (Open in apr.dev)`}
              >
                <Link
                  href={`https://www.apr.dev/program/${programId}`}
                  isExternal
                >
                  <IconButton
                    aria-label={`${
                      programInfo.verified ? "Verified" : "Unverified"
                    } Build (Open in apr.dev)`}
                    variant="ghost"
                    size="sm"
                    icon={
                      programInfo.verified ? (
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

        <Accounts accounts={accounts} />

        <Data data={data} />
      </Collapse>
    </Grid>
  );
};
