import createGlobalCachedFetch from "next-common/utils/createGlobalCachedFetch";
import { useCallback } from "react";
import { useRelayChainEndpoints } from "./useRelayChain";
import { getChainApi } from "next-common/utils/getChainApi";

const { useGlobalCachedFetch } = createGlobalCachedFetch();

export function useGlobalRelayChainApi() {
  const endpoints = useRelayChainEndpoints();
  const fetchDataFunc = useCallback(
    async (setResult) => {
      const api = await getChainApi(endpoints);
      setResult(api);
    },
    [endpoints],
  );

  const { result: api, loading } = useGlobalCachedFetch(
    fetchDataFunc,
    "relayChainApi",
  );

  return {
    api,
    loading,
  };
}
