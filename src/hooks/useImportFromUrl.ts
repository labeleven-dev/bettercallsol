import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { mapITransactionExtToIPreview } from "../mappers/external-to-preview";
import { mapTransactionResponseToIPreview } from "../mappers/web3js-to-preview";
import { IPreview } from "../types/preview";
import { useGetWeb3Transaction } from "./useGetWeb3Transaction";
import { usePersistentStore } from "./usePersistentStore";
import { useShallowSessionStoreWithoutUndo } from "./useSessionStore";
import { useWeb3Connection } from "./useWeb3Connection";

/**
 * Encapsulates logic for importing transctions using HTTP query parameters
 */
export const useImport = () => {
  const [set, setIsLoading] = useShallowSessionStoreWithoutUndo((state) => [
    state.set,
    (value: boolean) => {
      state.set((state) => {
        state.import.isLoading = value;
      });
    },
  ]);
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

  // TODO load the transaction in the preview sidebar
  // const preview = searchParams.has("preview");

  const tx = searchParams.get("tx");
  const share = searchParams.get("share");

  // import from transaction ID
  useEffect(() => {
    if (!tx) return;

    setIsLoading(true);
    setSearchParams({});

    start(tx, true);
  }, [tx, setIsLoading, start, setSearchParams]);

  // import from share URL
  useEffect(() => {
    if (!share) return;

    setIsLoading(true);
    setSearchParams({});

    axios
      .get(share)
      .then((response) => {
        set((state) => {
          state.import = {
            isLoading: false,
            transaction: mapITransactionExtToIPreview(
              response.data as IPreview,
              "shareUrl",
              share
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
          duration: 15000,
          isClosable: true,
        });
      });
  }, [share, set, setIsLoading, setSearchParams, toast]);
};
