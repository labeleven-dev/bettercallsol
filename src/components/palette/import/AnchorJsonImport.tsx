import { Flex, Textarea } from "@chakra-ui/react";
import { mapIdlToIPreview } from "../../../mappers/idl-to-preview";
import { IPreview } from "../../../types/preview";

export const AnchorJsonImport: React.FC<{
  setPreview: (tranaction: IPreview | undefined) => void;
  setError: (error: string) => void;
}> = ({ setPreview, setError }) => {
  const parse = (json: string) => {
    if (!json) return;

    setPreview(undefined);
    setError("");

    let prasedJson;
    try {
      prasedJson = JSON.parse(json);
      setPreview(mapIdlToIPreview(prasedJson, "anchorJson", ""));
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
        placeholder="Anchor JSON"
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
