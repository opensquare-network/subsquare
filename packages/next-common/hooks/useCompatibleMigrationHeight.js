import { useReferendumVotingFinishIndexer } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import useSubStorage from "./common/useSubStorage";
import { isContentMigrated } from "next-common/context/migration/conditionalApi";
import useChainOrScanHeight from "./height";

export function useCompatibleMigrationHeight() {
  const height = useChainOrScanHeight();
  const indexer = useReferendumVotingFinishIndexer();
  const isMigrated = isContentMigrated(indexer);
  const { result: relayChainHeight } = useSubStorage(
    "parachainSystem",
    "lastRelayChainBlockNumber",
  );

  if (isMigrated) {
    return relayChainHeight;
  }

  return height;
}
