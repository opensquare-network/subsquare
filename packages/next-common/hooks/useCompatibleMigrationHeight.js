import { useReferendumVotingFinishIndexer } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { isBeforeAhm } from "next-common/context/migration/conditionalApi";
import useChainOrScanHeight from "./height";
import { useRelayChainLatestHeight } from "next-common/hooks/relayScanHeight";
import { isAssetHubMigrated } from "next-common/utils/consts/isAssetHubMigrated";

export function useCompatibleMigrationHeight() {
  const relayChainHeight = useRelayChainLatestHeight();
  const localHeight = useChainOrScanHeight();
  const indexer = useReferendumVotingFinishIndexer();
  return isBeforeAhm(indexer) ? relayChainHeight : localHeight;
}

export function useAhmLatestHeight() {
  const relayChainHeight = useRelayChainLatestHeight();
  const localHeight = useChainOrScanHeight();
  return isAssetHubMigrated() ? relayChainHeight : localHeight;
}
