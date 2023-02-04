import { Idl, idlAddress } from "@project-serum/anchor/dist/cjs/idl";
import { Connection, PublicKey } from "@solana/web3.js";
import { useSessionStoreWithUndo } from "hooks/useSessionStore";
import { useWeb3Connection } from "hooks/useWeb3Connection";
import { programLabel } from "library/programs";
import { useEffect, useState } from "react";
import { IPubKey, IRpcEndpoint } from "types/internal";
import { parseIdl } from "utils/idl";
import { sentryCaptureException } from "utils/sentry";
import { isValidPublicKey } from "utils/web3js";

interface Web3AccountInfo {
  status: "new" | "inProgress" | "fetched" | "invalid";
  exists?: boolean;
  executable?: boolean;
  label?: string;
  idl?: Idl;
}

/**
 * Provides details of the provided Solana account by querying the chain
 */
export const useWeb3Account = (
  address: IPubKey,
  connection?: Connection,
  rpcEndpoint?: IRpcEndpoint
): Web3AccountInfo => {
  const [accountInfo, setAccountInfo] = useState<Web3AccountInfo>({
    status: "new",
  });

  const defaultConenction = useWeb3Connection();
  const activeConnection = connection || defaultConenction;

  const defaultRpcEndpoint = useSessionStoreWithUndo(
    (state) => state.rpcEndpoint
  );
  const activeRpcEndpoint = rpcEndpoint || defaultRpcEndpoint;

  useEffect(() => {
    if (!activeConnection || !isValidPublicKey(address)) {
      setAccountInfo({ status: "invalid" });
      return;
    }

    const fetch = async () => {
      setAccountInfo({ status: "inProgress" });
      const pubkey = new PublicKey(address);
      const idlAddr = await idlAddress(pubkey);

      const [accountInfo, idlAccountInfo] =
        await activeConnection.getMultipleAccountsInfo([pubkey, idlAddr]);

      setAccountInfo({
        status: "fetched",
        exists: accountInfo !== null,
        executable: accountInfo?.executable || false,
        label: programLabel(address, activeRpcEndpoint.network),
        idl: idlAccountInfo
          ? (await parseIdl(idlAccountInfo.data)) ?? undefined
          : undefined,
      });
    };

    fetch().catch((e) => {
      sentryCaptureException(e);
    });
  }, [address, activeRpcEndpoint]); // TODO activeConnection causes a refresh

  return accountInfo;
};
