import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { mapITransactionExtToITransaction } from "../mappers/external-to-internal";
import { mapITransactionExtToIPreview } from "../mappers/external-to-preview";
import { mapProtobufToITransactionExt } from "../mappers/protobuf-to-external";
import { mapTransactionResponseToIPreview } from "../mappers/web3js-to-preview";
import { useGetWeb3Transaction } from "./useGetWeb3Transaction";
import { usePersistentStore } from "./usePersistentStore";
import {
  useSessionStoreWithUndo,
  useShallowSessionStoreWithoutUndo,
} from "./useSessionStore";
import { useWeb3Connection } from "./useWeb3Connection";

/**
 * Encapsulates logic for importing transctions using HTTP query parameters
 */
export const useImportFromUrl = () => {
  const [set, setIsLoading] = useShallowSessionStoreWithoutUndo((state) => [
    state.set,
    (value: boolean) => {
      state.set((state) => {
        state.import.isLoading = value;
      });
    },
  ]);
  const setTransaction = useSessionStoreWithUndo((state) => state.set);
  const [searchParams, setSearchParams] = useSearchParams();

  const toast = useToast();

  // determine network
  const network = searchParams.get("network");
  const rpcEndpoints = usePersistentStore(
    (state) => state.appOptions.rpcEndpoints
  );
  const rpcEndpoint = Object.values(rpcEndpoints.map).find(
    (endpoint) => endpoint.network === (network || "mainnet-beta")
  )!;

  const connection = useWeb3Connection(rpcEndpoint.url);
  const { start } = useGetWeb3Transaction({
    connection,
    onSuccess: (response) => {
      set((state) => {
        state.import = {
          isLoading: false,
          transaction: mapTransactionResponseToIPreview(response, rpcEndpoint),
        };
      });
    },
    onError: (error) => {
      setIsLoading(false);
      toast({
        title: "Transaction import failed",
        description: `Failed to fetch transcation: ${error.message}`,
        status: "error",
        duration: 15000,
        isClosable: true,
      });
    },
  });

  const showDescriptions = searchParams.get("annotate") !== null;

  const share = searchParams.get("share");
  const tx = searchParams.get("tx");
  const shareJson = searchParams.get("shareJson");

  // import from URL-encoded transaction
  useEffect(() => {
    if (!share) return;

    try {
      const external = mapProtobufToITransactionExt(share);
      const internal = mapITransactionExtToITransaction(external);

      setTransaction((state) => {
        state.transaction = internal;
      });
      set((state) => {
        state.uiState.descriptionVisible = showDescriptions;
      });

      setSearchParams({});
    } catch (e) {
      toast({
        title: "Transaction import failed",
        description: `Could not decode provided transcation`,
        status: "error",
        duration: 10000,
        isClosable: true,
      });
    }
  });

  // import from transaction ID
  useEffect(() => {
    if (!tx) return;

    setIsLoading(true);
    setSearchParams({});

    start(tx, true);
  }, [tx, setIsLoading, start, setSearchParams]);

  // import from share URL
  useEffect(() => {
    if (!shareJson) return;

    setIsLoading(true);
    setSearchParams({});

    axios
      .get(shareJson)
      .then((response) => {
        set((state) => {
          state.import = {
            isLoading: false,
            transaction: mapITransactionExtToIPreview(
              response.data,
              "shareUrl",
              shareJson
            ),
          };
        });
      })
      .catch((err) => {
        setIsLoading(false);
        toast({
          title: "Transaction import failed",
          description: `Cannot fetch transaction from URL: ${err}`,
          status: "error",
          duration: 10000,
          isClosable: true,
        });
      });
  }, [shareJson, set, setIsLoading, setSearchParams, toast]);
};
