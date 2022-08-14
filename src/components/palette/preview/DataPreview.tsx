import {
  Flex,
  FlexProps,
  Icon,
  Tag,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import {
  IInstrctionDataFieldExt,
  IInstructionDataExt,
} from "../../../types/external";

export const DataPreview: React.FC<
  { data: IInstructionDataExt } & FlexProps
> = ({ data: { format, value }, ...theRest }) => {
  return (
    <Flex {...theRest} alignItems="center">
      <Tooltip label="Instruction Data">
        <Flex>
          <DataIcon />
          <Text ml="2" mr="4" fontSize="sm">
            {format}
          </Text>
        </Flex>
      </Tooltip>

      {(format === "bufferLayout" || format === "borsh") && (
        <Tag mr="1" size="sm" colorScheme="green">
          {`${(value as IInstrctionDataFieldExt[]).length} Fields`}
        </Tag>
      )}
    </Flex>
  );
};

const DataIcon: React.FC = () => (
  <Icon viewBox="0 0 64 64" color={useColorModeValue("teal.400", "teal.200")}>
    <path
      d="M32.202 22.531h-5.6v18.938h5.6c2.865 0 4.862-1.41 5.993-4.232c.617-1.549.927-3.393.927-5.531c0-2.953-.464-5.221-1.39-6.801c-.927-1.583-2.77-2.374-5.53-2.374"
      fill="currentColor"
    ></path>
    <path
      d="M32 2C15.432 2 2 15.432 2 32s13.432 30 30 30s30-13.432 30-30S48.568 2 32 2m10.959 39.094c-2.102 3.609-5.346 5.414-9.732 5.414H20.716V17.492h12.511c1.799.025 3.297.236 4.492.629c2.035.67 3.684 1.896 4.944 3.682c1.012 1.443 1.7 3.006 2.068 4.686s.552 3.281.552 4.803c0 3.858-.774 7.126-2.324 9.802"
      fill="currentColor"
    ></path>
  </Icon>
);
