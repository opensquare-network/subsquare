import { isNil } from "lodash-es";
import { useMemo, useEffect, useState } from "react";
import { getChainApi, getChainApiAt } from "next-common/utils/getChainApi";
import { useChain, useChainSettings } from "next-common/context/chain";

const MIGRATION_BLOCK_TIME_MAP = {
  westend: 1747307424000,
};

/**
 * Get conditional API
 * @param {Object} indexer - Indexer object
 * @param {number|string} [finishHeightOrHash] - Optional block height or hash
 * @returns {Object} Conditional API object
 */
export default function useConditionApi(indexer, finishHeightOrHash) {
  const [conditionApi, setConditionApi] = useState(null);
  const [blockApi, setBlockApi] = useState(null);
  const chain = useChain();

  const {
    assetHubMigrated = false,
    relayChainEndpoints = [],
    endpoints = [],
  } = useChainSettings();

  const endpointUrls = useMemo(() => {
    if (isNil(indexer) || !indexer?.blockTime) {
      return [];
    }

    const migrationBlockTime = MIGRATION_BLOCK_TIME_MAP[chain] || 0;
    const indexerBlockTime = BigInt(indexer?.blockTime || 0);
    const migrationBlockTimeBN = BigInt(migrationBlockTime);

    if (!assetHubMigrated || indexerBlockTime >= migrationBlockTimeBN) {
      return endpoints?.map?.((item) => item.url) || [];
    }

    if (indexerBlockTime < migrationBlockTimeBN) {
      return relayChainEndpoints?.map?.((item) => item.url) || [];
    }

    return [];
  }, [assetHubMigrated, chain, endpoints, indexer, relayChainEndpoints]);

  useEffect(() => {
    if (!endpointUrls || endpointUrls?.length === 0) {
      return;
    }

    getChainApi(endpointUrls).then(setConditionApi);
  }, [endpointUrls]);

  useEffect(() => {
    if (!conditionApi || isNil(finishHeightOrHash)) {
      return;
    }

    getChainApiAt(conditionApi, finishHeightOrHash).then(setBlockApi);
  }, [conditionApi, finishHeightOrHash]);

  return isNil(finishHeightOrHash) ? conditionApi : blockApi;
}
