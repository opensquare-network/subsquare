import { useReferendumVotingFinishIndexer } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { isHistoricalContent } from "next-common/context/migration/conditionalApi";
import useChainOrScanHeight from "./height";
import { usePageProperties } from "next-common/context/page";

export function useCompatibleMigrationHeight() {
  const { relayScanHeight } = usePageProperties();
  const height = useChainOrScanHeight();
  const indexer = useReferendumVotingFinishIndexer();
  const isHistorical = isHistoricalContent(indexer);

  if (isHistorical) {
    return relayScanHeight;
  }

  return height;
}
