import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Center,
  Flex,
  Grid,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { ExpandableSection } from "components/common/ExpandableSection";
import { ExplorerButton } from "components/common/ExplorerButton";
import { useSessionStoreWithUndo } from "hooks/useSessionStore";
import { isValidPublicKey } from "utils/web3js";

export const AddressLookupTables: React.FC = () => {
  const [transactionVersion, tables, rpcEndpoint, update] =
    useSessionStoreWithUndo((state) => [
      state.transaction.version,
      state.transaction.addressLookupTables,
      state.rpcEndpoint,
      state.set,
    ]);

  const emptyBgColour = useColorModeValue("blackAlpha.50", "whiteAlpha.50");
  const totalCountColour = useColorModeValue("gray.400", "gray.600");

  if (transactionVersion === "legacy") return null;

  return (
    <ExpandableSection
      heading={
        <>
          Address Lookup Tables{" "}
          <Text
            as="span"
            textColor={totalCountColour}
          >{`(${tables.length})`}</Text>
        </>
      }
    >
      {tables.length === 0 && (
        <Center p="3" m="1" bgColor={emptyBgColour} rounded="md">
          <Text as="i" fontSize="sm" textColor="grey">
            No lookup tables yet. Click on <AddIcon ml="0.5" mr="0.5" w="2.5" />{" "}
            below to add one.
          </Text>
        </Center>
      )}
      {tables.map((address, index) => (
        <Flex key={index} mb="1">
          <InputGroup ml="7" size="sm">
            <Input
              size="sm"
              fontFamily="mono"
              value={address}
              onChange={(e) => {
                update((state) => {
                  state.transaction.addressLookupTables[index] = e.target.value;
                });
              }}
            />
            <InputRightElement>
              {isValidPublicKey(address) && (
                <ExplorerButton
                  size="xs"
                  variant="button"
                  valueType="account"
                  value={address}
                  rpcEndpoint={rpcEndpoint}
                />
              )}
            </InputRightElement>
          </InputGroup>
          <Tooltip label="Remove">
            <IconButton
              mt="1"
              ml="3"
              size="xs"
              aria-label="Remove"
              icon={<CloseIcon />}
              variant="ghost"
              onClick={() => {
                update((state) => {
                  state.transaction.addressLookupTables =
                    state.transaction.addressLookupTables.filter(
                      (_, i) => i !== index
                    );
                });
              }}
            />
          </Tooltip>
        </Flex>
      ))}
      <Grid>
        <Tooltip label="Add Lookup Table">
          <IconButton
            aria-label="Add Lookup Table"
            icon={<AddIcon />}
            variant="ghost"
            size="sm"
            onClick={() => {
              update((state) => {
                state.transaction.addressLookupTables.push("");
              });
            }}
          />
        </Tooltip>
      </Grid>
    </ExpandableSection>
  );
};
