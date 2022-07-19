import { AddIcon, DeleteIcon, DragHandleIcon } from "@chakra-ui/icons";
import {
  Flex,
  Grid,
  Icon,
  IconButton,
  Input,
  Select,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTransactionStore } from "../../hooks/useTransactionStore";
import { toSortedArray } from "../../models/sortable";

export const RpcEndpointOptions: React.FC = () => {
  const rpcEndpoints = useTransactionStore(
    (state) => state.appOptions.rpcEndpoints
  );
  const set = useTransactionStore((state) => state.set);

  return (
    <Grid>
      <Text mb="2">Add or remove custom RPC points, or re-order the list:</Text>
      {toSortedArray(rpcEndpoints).map(
        ({ network, provider, url, custom, enabled }, index) => (
          <Flex m="1" key={index}>
            <DragHandleIcon h="3" w="3" mt="12" mr="1" />

            <Grid p="4" flex="1" rounded="md" boxShadow="md">
              <Flex mb="1">
                <Select minW="150px" maxW="130px" mr="1" isDisabled={!custom}>
                  {["devnet", "testnet", "mainnet-beta"].map((n) => (
                    <option key={n} value={n} selected={network === n}>
                      {n}
                    </option>
                  ))}
                </Select>
                <Input
                  flex="1"
                  mr="1"
                  placeholder="Provider"
                  value={provider}
                  isReadOnly={!custom}
                />
                <Tooltip label={enabled ? "Disable" : "Enable"}>
                  <IconButton
                    mr="1"
                    aria-label={enabled ? "Disable" : "Enable"}
                    variant="ghost"
                    icon={
                      enabled ? <Icon as={FaEyeSlash} /> : <Icon as={FaEye} />
                    }
                    onClick={() => {}}
                  />
                </Tooltip>
                <Tooltip label="Remove">
                  <IconButton
                    aria-label="Remove"
                    icon={<DeleteIcon />}
                    variant="ghost"
                    isDisabled={!custom}
                    onClick={() => {}}
                  />
                </Tooltip>
              </Flex>

              <Input
                flex="1"
                mr="1"
                placeholder="RPC URL"
                fontFamily="mono"
                value={url}
                isReadOnly={!custom}
              />
            </Grid>
          </Flex>
        )
      )}

      <Tooltip label="Add RPC Endpoint">
        <IconButton
          mt="3"
          aria-label="Add RPC Endpoint"
          icon={<AddIcon />}
          variant="ghost"
          onClick={() => {}}
        />
      </Tooltip>
    </Grid>
  );
};
