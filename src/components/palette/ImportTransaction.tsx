import { CheckIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { ErrorAlert } from "components/common/ErrorAlert";
import { AnchorJsonImport } from "components/palette/import/AnchorJsonImport";
import { AnchorProgramIdImport } from "components/palette/import/AnchorProgramIdImport";
import { ShareJsonImport } from "components/palette/import/ShareJsonImport";
import { ShareUrlImport } from "components/palette/import/ShareUrlImport";
import { TransactionIdImport } from "components/palette/import/TransactionIdImport";
import { Preview } from "components/palette/preview/Preview";
import { useState } from "react";
import { IPreview, PreviewSource } from "types/preview";

const SOURCES: { source: PreviewSource; label: string; type: string }[] = [
  { source: "tx", label: "Transaction ID", type: "tx" },
  { source: "anchorProgramId", label: "Anchor Program ID", type: "anchor" },
  { source: "shareUrl", label: "Share URL", type: "share" },
  { source: "shareJson", label: "Share JSON", type: "share" },
  { source: "anchorJson", label: "Anchor IDL JSON", type: "anchor" },
];

export const ImportTransaction: React.FC = () => {
  const [source, setSource] = useState<PreviewSource>("tx");
  const [preview, setPreview] = useState<IPreview>();
  const [error, setError] = useState("");

  return (
    <Grid>
      <Flex mb="1">
        <Menu matchWidth={true}>
          <MenuButton flex="1" as={Button} size="sm">
            {SOURCES.find((x) => x.source === source)?.label}{" "}
            <ChevronDownIcon />
          </MenuButton>
          <MenuList fontSize="sm" zIndex="modal">
            {SOURCES.map(({ source: s, label, type }) => (
              <MenuItem
                key={s}
                icon={source === s ? <CheckIcon /> : undefined}
                onClick={() => {
                  setPreview(undefined); // clear
                  setSource(s);
                }}
              >
                <Badge
                  maxH="4"
                  mr="1"
                  colorScheme={
                    type === "tx"
                      ? "green"
                      : type === "share"
                      ? "purple"
                      : type === "anchor"
                      ? "blue"
                      : undefined
                  }
                >
                  {type}
                </Badge>
                {label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Flex>

      {source === "tx" && (
        <TransactionIdImport setPreview={setPreview} setError={setError} />
      )}
      {source === "shareUrl" && (
        <ShareUrlImport setPreview={setPreview} setError={setError} />
      )}
      {source === "shareJson" && (
        <ShareJsonImport setPreview={setPreview} setError={setError} />
      )}
      {source === "anchorProgramId" && (
        <AnchorProgramIdImport setPreview={setPreview} setError={setError} />
      )}
      {source === "anchorJson" && (
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
