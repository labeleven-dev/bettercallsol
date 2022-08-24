import { Flex, Textarea } from "@chakra-ui/react";
import Ajv from "ajv";
import { useMemo } from "react";
import { mapITransactionExtToIPreview } from "../../../mappers/external-to-preview";
import { JSON_SCHEMA } from "../../../types/external";
import { IPreview } from "../../../types/preview";

export const ShareJsonImport: React.FC<{
  setPreview: (tranaction: IPreview | undefined) => void;
  setError: (error: string) => void;
}> = ({ setPreview, setError }) => {
  const validate = useMemo(() => new Ajv().compile(JSON_SCHEMA), []);

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

    if (!validate(prasedJson)) {
      setError(validate.errors?.map((e) => e.message).join(", ")!);
      return;
    }

    setPreview(
      mapITransactionExtToIPreview(prasedJson as IPreview, "shareJson", "")
    );
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
