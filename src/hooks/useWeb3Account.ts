import { idlAddress } from "@project-serum/anchor/dist/cjs/idl";
import * as Sentry from "@sentry/react";
import { Connection, PublicKey } from "@solana/web3.js";
import axios from "axios";
import { useEffect, useState } from "react";
import { programLabel } from "../library/programs";
import { IPubKey, IRpcEndpoint } from "../types/internal";
import { isValidPublicKey } from "../utils/web3js";
import { useSessionStoreWithUndo } from "./useSessionStore";
import { useWeb3Connection } from "./useWeb3Connection";

interface Web3AccountInfo {
  status: "new" | "inProgress" | "fetched" | "invalid";
  exists?: boolean;
  executable?: boolean;
  label?: string;
  hasIdl?: boolean;
  aprVerified?: boolean | null;
}

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
      const accountInfo = await activeConnection.getAccountInfo(pubkey);

      let label = undefined;
      let hasIdl = false;
      let verified = null;
      if (accountInfo?.executable) {
        // get program label
        label = programLabel(address, activeRpcEndpoint.network);

        // check if program has IDL
        const idlAddr = await idlAddress(pubkey);
        const idlAccountInfo = await activeConnection.getAccountInfo(idlAddr);
        if (idlAccountInfo) {
          hasIdl = true;
        }

        // check if program in apr.dev
        const response = await axios.get(
          `https://anchor.projectserum.com/api/v0/program/${address}/latest?limit=1`
        );
        if (response?.status === 200 && response.data?.length > 0) {
          const build: { aborted: boolean; state: string; verified: string } =
            response.data[0];
          verified =
            !build.aborted &&
            build.state === "Built" &&
            build.verified === "Verified";
        }
      }
      setAccountInfo({
        status: "fetched",
        exists: accountInfo !== null,
        executable: accountInfo?.executable || false,
        label,
        hasIdl,
        aprVerified: verified,
      });
    };

    fetch().catch((e) => {
      Sentry.captureException(e);
    });
  }, [address, activeConnection, activeRpcEndpoint]);

  return accountInfo;
};
