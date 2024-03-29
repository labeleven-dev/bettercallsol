import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import {
  Flex,
  FormLabel,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { ExplorerButton } from "components/common/ExplorerButton";
import {
  useSessionStoreWithUndo,
  useSessionStoreWithoutUndo,
} from "hooks/useSessionStore";
import React, { useState } from "react";
import { toSol } from "utils/web3js";

export const BalanceTable: React.FC = () => {
  const [showOnlyChanges, setShowOnlyChanges] = useState(true);
  const rpcEndpoint = useSessionStoreWithUndo((state) => state.rpcEndpoint);
  const balances = useSessionStoreWithoutUndo(
    (state) => state.transactionRun.balances ?? []
  );

  return (
    <TableContainer fontSize="sm" mb="8">
      <Flex>
        <FormLabel htmlFor="onlyChanges" fontSize="sm">
          Show only balance changes
        </FormLabel>
        <Switch
          id="onlyChanges"
          size="sm"
          isChecked={showOnlyChanges}
          onChange={() => {
            setShowOnlyChanges(!showOnlyChanges);
          }}
        />
      </Flex>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Address</Th>
            <Th isNumeric>Balance Before</Th>
            <Th isNumeric>Balance After</Th>
            <Th isNumeric>Change</Th>
          </Tr>
        </Thead>
        <Tbody>
          {balances
            .filter(
              ({ before, after }) => !showOnlyChanges || after - before !== 0
            )
            .map(({ address, before, after }, index) => {
              const change = after - before;

              return (
                <Tr key={index}>
                  <Td>
                    <ExplorerButton
                      value={address}
                      valueType="account"
                      rpcEndpoint={rpcEndpoint}
                      variant="long-link"
                      fontFamily="mono"
                      fontWeight="normal"
                      fontSize="sm"
                    />
                    {/* TODO tag with account names from instructions */}
                    {/* <br />
                    {names.map((name, index) => (
                      <Tag key={index}>{name}</Tag>
                    ))} */}
                  </Td>
                  <Td isNumeric>
                    {before >= 0 ? toSol(before).toFixed() : "N/A"}
                  </Td>
                  <Td isNumeric>
                    {after >= 0 ? toSol(after).toFixed() : "N/A"}
                  </Td>
                  {before >= 0 && after >= 0 ? (
                    <Td isNumeric>
                      {toSol(change).toFixed()}&nbsp;
                      {change > 0 ? (
                        <ArrowUpIcon color="green" />
                      ) : change < 0 ? (
                        <ArrowDownIcon color="red" />
                      ) : (
                        ""
                      )}
                    </Td>
                  ) : (
                    <Td isNumeric>N/A</Td>
                  )}
                </Tr>
              );
            })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
