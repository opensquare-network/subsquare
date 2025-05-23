import { useEffect } from "react";
import { createGlobalState } from "react-use";
import { useReferendumVotingFinishIndexer } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { isHistoricalContent } from "next-common/context/migration/conditionalApi";
import useChainOrScanHeight from "./height";
import { useContextApi } from "next-common/context/api";

const useCompatibleMigrationHeightState = createGlobalState();

export function useCompatibleMigrationHeight() {
  const [compatibleMigrationHeight, setCompatibleMigrationHeight] =
    useCompatibleMigrationHeightState();
  const api = useContextApi();
  const height = useChainOrScanHeight();
  const indexer = useReferendumVotingFinishIndexer();
  const isHistorical = isHistoricalContent(indexer);

  useEffect(() => {
    if (!api || !isHistorical) {
      return;
    }
    api?.query?.parachainSystem
      ?.lastRelayChainBlockNumber()
      .then((relayParent) => {
        setCompatibleMigrationHeight(relayParent.toNumber());
      });
  }, [api, isHistorical, height, setCompatibleMigrationHeight]);

  if (isHistorical) {
    return compatibleMigrationHeight;
  }

  return height;
}
