import { useReferendumVotingFinishIndexer } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { isBeforeAhm } from "next-common/context/migration/conditionalApi";
import useChainOrScanHeight from "./height";
import { useRelayChainLatestHeight } from "next-common/hooks/relayScanHeight";

export function useCompatibleMigrationHeight() {
  const relayChainHeight = useRelayChainLatestHeight();
  const localHeight = useChainOrScanHeight();
  const indexer = useReferendumVotingFinishIndexer();
  return isBeforeAhm(indexer) ? relayChainHeight : localHeight;
}
