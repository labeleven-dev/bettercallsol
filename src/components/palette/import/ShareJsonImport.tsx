import { Flex, Textarea } from "@chakra-ui/react";
import Ajv from "ajv";
import { useMemo } from "react";
import { JSON_SCHEMA } from "../../../models/external-types";
import { mapITransactionExtToITransactionPreview } from "../../../models/preview-mappers";
import { ITransactionPreview } from "../../../models/preview-types";

export const ShareJsonImport: React.FC<{
  setTransaction: (tranaction: ITransactionPreview | undefined) => void;
  setError: (error: string) => void;
}> = ({ setTransaction, setError }) => {
  const validate = useMemo(() => new Ajv().compile(JSON_SCHEMA), []);

  const parse = (json: string) => {
    if (!json) return;

    setTransaction(undefined);
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

    setTransaction(
      mapITransactionExtToITransactionPreview(
        prasedJson as ITransactionPreview,
        "shareJson",
        ""
      )
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
