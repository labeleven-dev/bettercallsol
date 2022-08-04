import { DownloadIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Input, Tooltip } from "@chakra-ui/react";
import Ajv from "ajv";
import axios from "axios";
import { useMemo, useState } from "react";
import { JSON_SCHEMA } from "../../../models/external-types";
import { mapITransactionExtToITransactionPreview } from "../../../models/preview-mappers";
import { ITransactionPreview } from "../../../models/preview-types";

export const ShareUrlImport: React.FC<{
  setTransaction: (tranaction: ITransactionPreview | undefined) => void;
  setError: (error: string) => void;
}> = ({ setTransaction, setError }) => {
  const [url, setUrl] = useState("");
  const [inProgress, setInprogress] = useState(false);
  const validate = useMemo(() => new Ajv().compile(JSON_SCHEMA), []);

  const search = () => {
    if (!url) return;

    setInprogress(true);
    setTransaction(undefined);
    setError("");

    axios
      .get(url)
      .then((response) => {
        if (!validate(response.data)) {
          setError(validate.errors?.map((e) => e.message).join(", ")!);
          return;
        }
        setTransaction(
          mapITransactionExtToITransactionPreview(
            response.data as ITransactionPreview,
            "shareUrl",
            url
          )
        );
        setInprogress(false);
      })
      .catch((err) => {
        setError(err);
        setInprogress(false);
      });
  };

  return (
    <Flex>
      <Input
        flex="1"
        mr="1"
        fontFamily="mono"
        placeholder="URL"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
        }}
      />

      <Tooltip label="Fetch">
        <IconButton
          isLoading={inProgress}
          aria-label="Fetch"
          icon={<DownloadIcon />}
          onClick={search}
        />
      </Tooltip>
    </Flex>
  );
};
