import { idlAddress } from "@project-serum/anchor/dist/cjs/idl";
import { Connection, PublicKey } from "@solana/web3.js";
import axios from "axios";
import { useEffect, useState } from "react";
import { IPubKey } from "../models/internal-types";
import { isValidPublicKey } from "../models/web3js-mappers";
import { useAnchorProvider } from "./useAnchorProvider";

interface Web3AccountInfo {
  status: "new" | "inProgress" | "fetched" | "invalid";
  exists?: boolean;
  executable?: boolean;
  hasIdl?: boolean;
  verified?: boolean | null;
}

export const useWeb3Account = (
  address: IPubKey,
  connection?: Connection
): Web3AccountInfo => {
  const [accountInfo, setAccountInfo] = useState<Web3AccountInfo>({
    status: "new",
  });
  const { connection: activeConnection, provider } =
    useAnchorProvider(connection);

  useEffect(() => {
    if (!activeConnection || !provider || !isValidPublicKey(address)) {
      setAccountInfo({ status: "invalid" });
      return;
    }

    const fetch = async () => {
      setAccountInfo({ status: "inProgress" });
      const pubkey = new PublicKey(address);
      const accountInfo = await activeConnection.getAccountInfo(pubkey);

      let hasIdl = false;
      let verified = null;
      if (accountInfo?.executable) {
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
        hasIdl,
        verified,
      });
    };

    fetch().catch(console.log); // TODO better error handling? Too noisy for user
  }, [address, activeConnection, provider]);

  return accountInfo;
};
