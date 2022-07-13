import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import {
  Flex,
  FormLabel,
  Switch,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { IBalance, toSol } from "../../web3";

export const BalanceTable: React.FC<{
  balances: IBalance[];
}> = ({ balances }) => {
  const [showOnlyChanges, setShowOnlyChanges] = useState(true);

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
            .map(({ address, names, before, after }, index) => {
              const change = after - before;

              return (
                <Tr key={index}>
                  <Td>
                    {address}
                    <br />
                    {names.map((name, index) => (
                      <Tag key={index}>{name}</Tag>
                    ))}
                  </Td>
                  <Td isNumeric>{toSol(before)}</Td>
                  <Td isNumeric>{toSol(after)}</Td>
                  <Td isNumeric>
                    {toSol(change)}&nbsp;
                    {change > 0 ? (
                      <ArrowUpIcon color="green" />
                    ) : change < 0 ? (
                      <ArrowDownIcon color="red" />
                    ) : (
                      ""
                    )}
                  </Td>
                </Tr>
              );
            })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
