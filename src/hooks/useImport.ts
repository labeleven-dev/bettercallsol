import { useToast } from "@chakra-ui/react";
import Ajv from "ajv";
import axios from "axios";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { JSON_SCHEMA } from "../models/external-types";
import {
  mapITransactionExtToITransactionPreview,
  mapTransactionResponseToITransactionPreview,
} from "../models/preview-mappers";
import { ITransactionPreview } from "../models/preview-types";
import { useGetWeb3Transaction } from "./useGetWeb3Transaction";
import { usePersistentStore } from "./usePersistentStore";
import { useSessionStoreWithoutUndo } from "./useSessionStore";

export const useImport = () => {
  const [set, setIsLoading] = useSessionStoreWithoutUndo((state) => [
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

  const { start } = useGetWeb3Transaction({
    rpcEndpointUrl: rpcEndpoint.url,
    onFinalised: (response) => {
      set((state) => {
        state.import = {
          isLoading: false,
          transaction: mapTransactionResponseToITransactionPreview(
            response,
            rpcEndpoint
          ),
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

  const validate = useMemo(() => new Ajv().compile(JSON_SCHEMA), []);

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
        if (!validate(response.data)) {
          setIsLoading(false);
          // TODO why is this triggering 3 times?
          toast({
            title: "Transaction import failed",
            description: `Invalid JSON from URL`,
            status: "error",
            duration: 15000,
            isClosable: true,
          });
          return;
        }

        set((state) => {
          state.import = {
            isLoading: false,
            transaction: mapITransactionExtToITransactionPreview(
              response.data as ITransactionPreview,
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
          description: `Cannot fetch tranasction from URL: ${err}`,
          status: "error",
          duration: 15000,
          isClosable: true,
        });
      });
  }, [share, set, setIsLoading, setSearchParams, toast, validate]);
};
