import { useEffect, useState, useMemo } from "react";
import { useContextApi } from "next-common/context/api";
import { isAssetHubMigrated } from "next-common/utils/consts/isAssetHubMigrated";
import { useGlobalRelayChainApi } from "next-common/hooks/useGlobalRelayChainApi";

export default function useAhmLatestHeightSnapshot() {
  const localApi = useContextApi();
  const relayApi = useGlobalRelayChainApi();
  const [snapshotHeight, setSnapshotHeight] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const targetApi = useMemo(() => {
    return isAssetHubMigrated() ? relayApi : localApi;
  }, [localApi, relayApi]);

  useEffect(() => {
    if (!targetApi) {
      return;
    }

    targetApi.rpc.chain
      .getHeader()
      .then((header) => {
        const latestUnFinalizedHeight = header.number.toNumber();
        setSnapshotHeight(latestUnFinalizedHeight);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Failed to fetch latest height:", error);
      });
  }, [targetApi]);

  return {
    isLoading,
    latestHeight: snapshotHeight,
  };
}
