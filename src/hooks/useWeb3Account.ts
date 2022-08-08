import { idlAddress } from "@project-serum/anchor/dist/cjs/idl";
import { Connection, PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { IPubKey } from "../models/internal-types";
import { isValidPublicKey } from "../models/web3js-mappers";
import { useAnchorProvider } from "./useAnchorProvider";

interface Web3AccountInfo {
  status: "new" | "inProgress" | "fetched" | "invalid";
  exists?: boolean;
  executable?: boolean;
  hasIdl?: boolean;
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
      if (accountInfo?.executable) {
        const idlAddr = await idlAddress(pubkey);
        const idlAccountInfo = await activeConnection.getAccountInfo(idlAddr);
        if (idlAccountInfo) {
          hasIdl = true;
        }
      }
      setAccountInfo({
        status: "fetched",
        exists: accountInfo !== null,
        executable: accountInfo?.executable || false,
        hasIdl,
      });
    };

    fetch().catch(console.log); // TODO better error handling? Too noisy for user
  }, [address, activeConnection, provider]);

  return accountInfo;
};
