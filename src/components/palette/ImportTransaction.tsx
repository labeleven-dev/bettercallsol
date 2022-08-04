import { CheckIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Grid,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useState } from "react";
import { ITransactionPreview, PreviewSource } from "../../models/preview-types";
import { ErrorAlert } from "../common/ErrorAlert";
import { ShareJsonImport } from "./import/ShareJsonImport";
import { ShareUrlImport } from "./import/ShareUrlImport";
import { TransactionIdImport } from "./import/TransactionIdImport";
import { TransactionPreview } from "./preview/TransactionPreview";

const IMPORT_TYPES: Record<PreviewSource, string> = {
  tx: "Transaction ID",
  shareUrl: "Share URL",
  shareJson: "Share JSON",
};

export const ImportTransaction: React.FC = () => {
  const [importType, setImportType] = useState<PreviewSource>("tx");
  const [transaction, setTransaction] = useState<ITransactionPreview>();
  const [error, setError] = useState("");

  return (
    <Grid>
      <Flex mb="1">
        <Menu>
          <MenuButton flex="1" as={Button} size="sm">
            {IMPORT_TYPES[importType]} <ChevronDownIcon />
          </MenuButton>
          <MenuList fontSize="sm">
            {Object.entries(IMPORT_TYPES).map(([type, label]) => (
              <MenuItem
                key={type}
                icon={type === importType ? <CheckIcon /> : undefined}
                onClick={() => {
                  setImportType(type as PreviewSource);
                }}
              >
                {label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Flex>

      {importType === "tx" && (
        <TransactionIdImport
          setTransaction={setTransaction}
          setError={setError}
        />
      )}
      {importType === "shareUrl" && (
        <ShareUrlImport setTransaction={setTransaction} setError={setError} />
      )}
      {importType === "shareJson" && (
        <ShareJsonImport setTransaction={setTransaction} setError={setError} />
      )}

      <ErrorAlert
        mt="5"
        error={error}
        onClose={() => {
          setError("");
        }}
      />

      <Box mt="5">
        {transaction && <TransactionPreview transaction={transaction} />}
      </Box>
    </Grid>
  );
};
