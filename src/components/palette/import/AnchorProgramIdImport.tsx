import { DownloadIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Input, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { usePersistentStore } from "../../../hooks/usePersistentStore";
import { useWeb3Connection } from "../../../hooks/useWeb3Connection";
import { mapIdlToIPreview } from "../../../mappers/idl-to-preview";
import { IRpcEndpoint } from "../../../types/internal";
import { IPreview } from "../../../types/preview";
import { fetchIdl } from "../../../utils/idl";
import { isValidPublicKey } from "../../../utils/web3js";
import { RpcEndpointMenu } from "../../common/RpcEndpointMenu";

export const AnchorProgramIdImport: React.FC<{
  setPreview: (tranaction: IPreview | undefined) => void;
  setError: (error: string) => void;
}> = ({ setPreview, setError }) => {
  const [programId, setProgramId] = useState("");
  const [inProgress, setInprogress] = useState(false);
  const rpcEndpoints = usePersistentStore(
    (state) => state.appOptions.rpcEndpoints
  );
  const [rpcEndpoint, setRpcEndpoint] = useState<IRpcEndpoint>(
    Object.values(rpcEndpoints.map).find(
      (endpoint) => endpoint.network === "mainnet-beta"
    )!
  );

  const connection = useWeb3Connection(rpcEndpoint.url);

  const fetch = async () => {
    if (!programId || !isValidPublicKey(programId)) {
      setError("Invalid program ID");
      return;
    }

    if (!connection) {
      setError("Connection could not be established");
      return;
    }

    setInprogress(true);
    setPreview(undefined);
    setError("");

    try {
      let idl = await fetchIdl(programId, connection);
      if (idl) {
        setPreview(
          mapIdlToIPreview(idl, "anchorProgramId", programId, rpcEndpoint)
        );
      } else {
        setError("IDL not found");
      }
    } catch (error) {
      setError(error as string);
    }

    setInprogress(false);
  };

  return (
    <Flex>
      <Input
        flex="1"
        mr="1"
        fontFamily="mono"
        placeholder="Program ID"
        value={programId}
        onChange={(e) => {
          setProgramId(e.target.value);
        }}
      />

      <RpcEndpointMenu
        variant="short"
        menuButtonProps={{ mr: "1" }}
        menuListProps={{ fontSize: "sm" }}
        endpoint={rpcEndpoint}
        setEndpoint={setRpcEndpoint}
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
