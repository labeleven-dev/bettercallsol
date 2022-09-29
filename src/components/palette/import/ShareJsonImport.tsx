import { Flex, Textarea } from "@chakra-ui/react";
import { mapITransactionExtToIPreview } from "../../../mappers/external-to-preview";
import { IPreview } from "../../../types/preview";

export const ShareJsonImport: React.FC<{
  setPreview: (tranaction: IPreview | undefined) => void;
  setError: (error: string) => void;
}> = ({ setPreview, setError }) => {
  const parse = (json: string) => {
    if (!json) return;

    setPreview(undefined);
    setError("");

    try {
      let parsedJson = JSON.parse(json);
      setPreview(mapITransactionExtToIPreview(parsedJson, "shareJson", ""));
    } catch (e) {
      setError("Invalid JSON");
      return;
    }
  };

  return (
    <Flex>
      {/* TODO syntax highlighting */}
      <Textarea
        flex="1"
        h="200px"
        fontFamily="mono"
        fontSize="sm"
        size="sm"
        placeholder="Share JSON"
        onChange={(e) => {
          parse(e.target.value);
        }}
        // no wrap
        whiteSpace="pre"
        overflowWrap="normal"
        overflow="scroll"
      />
    </Flex>
  );
};
