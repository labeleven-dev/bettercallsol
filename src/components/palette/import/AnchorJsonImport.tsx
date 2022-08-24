import { Flex, Textarea } from "@chakra-ui/react";
import { mapIdlToIPreview } from "../../../mappers/idl-to-preview";
import { IPreview } from "../../../types/preview";

export const AnchorJsonImport: React.FC<{
  setPreview: (tranaction: IPreview | undefined) => void;
  setError: (error: string) => void;
}> = ({ setPreview, setError }) => {
  // TODO
  // const validate = useMemo(() => new Ajv().compile(JSON_SCHEMA), []);

  const parse = (json: string) => {
    if (!json) return;

    setPreview(undefined);
    setError("");

    let prasedJson;
    try {
      prasedJson = JSON.parse(json);
    } catch (e) {
      setError("Invalid JSON");
      return;
    }

    // TODO
    // if (!validate(prasedJson)) {
    //   setError(validate.errors?.map((e) => e.message).join(", ")!);
    //   return;
    // }

    setPreview(mapIdlToIPreview(prasedJson, "anchorJson", ""));
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
