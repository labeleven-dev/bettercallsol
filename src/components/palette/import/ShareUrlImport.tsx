import { DownloadIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Input, Tooltip } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { mapITransactionExtToIPreview } from "../../../mappers/external-to-preview";
import { IPreview } from "../../../types/preview";

export const ShareUrlImport: React.FC<{
  setPreview: (tranaction: IPreview | undefined) => void;
  setError: (error: string) => void;
}> = ({ setPreview, setError }) => {
  const [url, setUrl] = useState("");
  const [inProgress, setInprogress] = useState(false);

  const fetch = async () => {
    if (!url) return;

    setInprogress(true);
    setPreview(undefined);
    setError("");

    try {
      const response = await axios.get(url);
      setPreview(
        mapITransactionExtToIPreview(response.data as IPreview, "shareUrl", url)
      );
      setInprogress(false);
    } catch (err) {
      const error =
        typeof err === "string"
          ? err
          : Object.getOwnPropertyNames(err).includes("message")
          ? (err as { message: string }).message
          : "Unexpected error";
      setError(error);
      setInprogress(false);
    }
  };

  return (
    <Flex>
      <Input
        flex="1"
        mr="1"
        fontFamily="mono"
        placeholder="URL"
        size="sm"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
        }}
      />

      <Tooltip label="Fetch">
        <IconButton
          isLoading={inProgress}
          size="sm"
          aria-label="Fetch"
          icon={<DownloadIcon />}
          onClick={fetch}
        />
      </Tooltip>
    </Flex>
  );
};
