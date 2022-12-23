import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { validate } from "generated/validate/index.mjs";
import { useConfigStore } from "hooks/useConfigStore";
import { useGetWeb3Transaction } from "hooks/useGetWeb3Transaction";
import {
  useSessionStoreWithoutUndo,
  useSessionStoreWithUndo,
} from "hooks/useSessionStore";
import { useWeb3Connection } from "hooks/useWeb3Connection";
import { mapITransactionExtToITransaction } from "mappers/external-to-internal";
import { mapITransactionExtToIPreview } from "mappers/external-to-preview";
import { mapIPreviewToITransaction } from "mappers/preview-to-internal";
import { mapProtobufToITransactionExt } from "mappers/protobuf-to-external";
import { mapTransactionResponseToIPreview } from "mappers/web3js-to-preview";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { short } from "utils/web3js";

const DEFAULT_STATUS = { isLoading: false, status: "" };

/**
 * Encapsulates logic for importing transctions using HTTP query parameters
 */
export const useImportFromUrl = (): {
  isLoading: boolean;
  status: string;
  cancel: () => void;
} => {
  const setTransaction = useSessionStoreWithUndo((state) => state.set);
  const setUI = useSessionStoreWithoutUndo((state) => state.set);
  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useState(DEFAULT_STATUS);
  const toast = useToast();

  const network = searchParams.get("network");
  const showDescriptions = searchParams.get("annotate") !== null;
  const share = searchParams.get("share");
  const tx = searchParams.get("tx");
  const shareJson = searchParams.get("shareJson");

  // determine network
  const rpcEndpoints = useConfigStore((state) => state.appOptions.rpcEndpoints);

  // import from URL-encoded transaction
  useEffect(() => {
    if (!share) return;

    try {
      const external = mapProtobufToITransactionExt(share);
      if (!validate(external)) {
        throw new Error("Invalid payload");
      }
      const internal = mapITransactionExtToITransaction(external);

      setTransaction((state) => {
        state.transaction = internal;
        state.rpcEndpoint = Object.values(rpcEndpoints.map).find(
          (endpoint) =>
            endpoint.network === (network || external.network || "mainnet-beta")
        )!;
      });
      setUI((state) => {
        state.uiState.descriptionVisible = showDescriptions;
      });

      setSearchParams({});
    } catch (e) {
      toast({
        title: "Transaction import failed",
        description: `Could not decode the provided transcation`,
        status: "error",
        duration: 10000,
        isClosable: true,
      });
    }
  });

  // import from transaction ID
  const rpcEndpoint = Object.values(rpcEndpoints.map).find(
    (endpoint) => endpoint.network === (network || "mainnet-beta")
  )!;

  const connection = useWeb3Connection(rpcEndpoint.url);
  const { start: startGetWeb3Transcation, cancel: cancelGetWeb3Transaction } =
    useGetWeb3Transaction({
      connection,
      onSuccess: (response) => {
        setStatus(DEFAULT_STATUS);
        setTransaction((state) => {
          state.transaction = mapIPreviewToITransaction(
            mapTransactionResponseToIPreview(response, rpcEndpoint)
          );
        });
        setUI((state) => {
          state.uiState.descriptionVisible = showDescriptions;
        });
      },
      onError: (error) => {
        setStatus(DEFAULT_STATUS);
        toast({
          title: "Transaction import failed",
          description: `Failed to fetch the transcation: ${error.message}`,
          status: "error",
          duration: 15000,
          isClosable: true,
        });
      },
    });

  useEffect(() => {
    if (!tx) return;

    setStatus({
      isLoading: true,
      status: `Fetching ${short(tx)} from ${rpcEndpoint.network} (${
        rpcEndpoint.provider
      })...`,
    });
    setSearchParams({});
    startGetWeb3Transcation(tx, true);
  }, [tx, startGetWeb3Transcation, setSearchParams, rpcEndpoint]);

  // import from share URL
  const abortController = useMemo(() => {
    if (!shareJson) return;

    const abortController = new AbortController();

    setStatus({
      isLoading: true,
      status: `Fetching from ${shareJson.substring(
        0,
        Math.min(shareJson.length, 40)
      )}...`,
    });
    setSearchParams({});

    axios
      .get(shareJson, { signal: abortController.signal })
      .then((response) => {
        setStatus(DEFAULT_STATUS);
        setTransaction((state) => {
          if (!validate(shareJson)) {
            // @ts-ignore
            console.log(validateITransactionExt.errors);
            throw new Error("Invalid payload");
          }
          state.transaction = mapIPreviewToITransaction(
            mapITransactionExtToIPreview(response.data, "shareUrl", shareJson)
          );
        });
      })
      .catch((err) => {
        setStatus(DEFAULT_STATUS);
        toast({
          title: "Transaction import failed",
          description: `Cannot fetch transaction from the URL: ${err}`,
          status: "error",
          duration: 10000,
          isClosable: true,
        });
      });

    return abortController;
  }, [shareJson, setStatus, setSearchParams, toast, setTransaction]);

  return {
    ...status,
    cancel: () => {
      if (cancelGetWeb3Transaction) cancelGetWeb3Transaction();
      if (abortController) abortController.abort();
    },
  };
};
