import { isNil } from "lodash-es";
import getChainSettings from "next-common/utils/consts/settings";
import { useMemo, useEffect, useState } from "react";
import { getChainApi, getChainApiAt } from "next-common/utils/getChainApi";
import { useChain } from "next-common/context/chain";

function isUseRelayChainHistoryApi(indexer, assetHubMigrated = false) {
  // TODO: judgement by indexer
  const isMigaratedIndexer = indexer?.blockHeight > 0;
  return isMigaratedIndexer && assetHubMigrated;
}

export default function useConditionApi(indexer) {
  const [conditionApi, setConditionApi] = useState(null);
  const chain = useChain();

  const endpointUrls = useMemo(() => {
    if (isNil(indexer)) {
      return [];
    }

    const { assetHubMigrated, relayChainEndpoints, endpoints } =
      getChainSettings(chain);
    const targetEndpoints = isUseRelayChainHistoryApi(indexer, assetHubMigrated)
      ? relayChainEndpoints
      : endpoints;

    return targetEndpoints?.map?.((item) => item.url) || [];
  }, [chain, indexer]);

  useEffect(() => {
    if (!endpointUrls || endpointUrls?.length === 0) {
      return;
    }

    getChainApi(endpointUrls).then(setConditionApi);

    return () => {
      if (conditionApi) {
        conditionApi.disconnect?.();
      }
    };
  }, [conditionApi, endpointUrls]);

  return conditionApi;
}

export function useConditionBlockApi(condition, blockHeightOrHash) {
  const [api, setApi] = useState(null);

  useEffect(() => {
    if (condition) {
      getChainApiAt(condition, blockHeightOrHash).then(setApi);
    }
  }, [blockHeightOrHash, condition]);

  return api;
}
