import { DownloadIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Input, Tooltip } from "@chakra-ui/react";
import Ajv from "ajv";
import axios from "axios";
import { useMemo, useState } from "react";
import { JSON_SCHEMA } from "../../../models/external-types";
import { mapITransactionExtToIPreview } from "../../../models/preview-mappers";
import { IPreview } from "../../../models/preview-types";

export const ShareUrlImport: React.FC<{
  setPreview: (tranaction: IPreview | undefined) => void;
  setError: (error: string) => void;
}> = ({ setPreview, setError }) => {
  const [url, setUrl] = useState("");
  const [inProgress, setInprogress] = useState(false);
  const validate = useMemo(() => new Ajv().compile(JSON_SCHEMA), []);

  const fetch = () => {
    if (!url) return;

    setInprogress(true);
    setPreview(undefined);
    setError("");

    axios
      .get(url)
      .then((response) => {
        if (!validate(response.data)) {
          setError(validate.errors?.map((e) => e.message).join(", ")!);
          return;
        }
        setPreview(
          mapITransactionExtToIPreview(
            response.data as IPreview,
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
          onClick={fetch}
        />
      </Tooltip>
    </Flex>
  );
};
