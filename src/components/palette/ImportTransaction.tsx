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
import { IPreview, PreviewSource } from "../../types/preview";
import { ErrorAlert } from "../common/ErrorAlert";
import { AnchorJsonImport } from "./import/AnchorJsonImport";
import { AnchorProgramIdImport } from "./import/AnchorProgramIdImport";
import { ShareJsonImport } from "./import/ShareJsonImport";
import { ShareUrlImport } from "./import/ShareUrlImport";
import { TransactionIdImport } from "./import/TransactionIdImport";
import { Preview } from "./preview/Preview";

const IMPORT_TYPES: Record<PreviewSource, string> = {
  tx: "Transaction ID",
  shareUrl: "Share URL",
  shareJson: "Share JSON",
  anchorProgramId: "Anchor Program ID",
  anchorJson: "Anchor IDL JSON",
};

export const ImportTransaction: React.FC = () => {
  const [importType, setImportType] = useState<PreviewSource>("tx");
  const [preview, setPreview] = useState<IPreview>();
  const [error, setError] = useState("");

  return (
    <Grid>
      <Flex mb="1">
        <Menu matchWidth={true}>
          <MenuButton flex="1" as={Button} size="sm">
            {IMPORT_TYPES[importType]} <ChevronDownIcon />
          </MenuButton>
          <MenuList fontSize="sm" zIndex="modal">
            {Object.entries(IMPORT_TYPES).map(([type, label]) => (
              <MenuItem
                key={type}
                icon={type === importType ? <CheckIcon /> : undefined}
                onClick={() => {
                  setPreview(undefined); // clear
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
        <TransactionIdImport setPreview={setPreview} setError={setError} />
      )}
      {importType === "shareUrl" && (
        <ShareUrlImport setPreview={setPreview} setError={setError} />
      )}
      {importType === "shareJson" && (
        <ShareJsonImport setPreview={setPreview} setError={setError} />
      )}
      {importType === "anchorProgramId" && (
        <AnchorProgramIdImport setPreview={setPreview} setError={setError} />
      )}
      {importType === "anchorJson" && (
        <AnchorJsonImport setPreview={setPreview} setError={setError} />
      )}

      <ErrorAlert
        mt="5"
        error={error}
        onClose={() => {
          setError("");
        }}
      />

      <Box mt="5">{preview && <Preview preview={preview} />}</Box>
    </Grid>
  );
};
