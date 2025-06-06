import { useReferendumVotingFinishIndexer } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import useChainOrScanHeight from "./height";
import { useRelayChainLatestHeight } from "next-common/hooks/relayScanHeight";
import { isAssetHubMigrated } from "next-common/utils/consts/isAssetHubMigrated";
import getChainSettings from "next-common/utils/consts/settings";
import { isNil } from "lodash-es";

// check whether a time point is before asset hub migration. AHM = asset hub migration.
export function isBeforeAhm(indexer) {
  if (!indexer || !isAssetHubMigrated()) {
    return false;
  }

  const settings = getChainSettings(process.env.NEXT_PUBLIC_CHAIN) || {};
  const { assethubMigration: { timestamp: migrationBlockTime } = {} } =
    settings;
  return (
    !isNil(indexer) &&
    BigInt(indexer?.blockTime || 0) < BigInt(migrationBlockTime)
  );
}

export function useCompatibleMigrationHeight() {
  const relayChainHeight = useRelayChainLatestHeight();
  const localHeight = useChainOrScanHeight();
  const indexer = useReferendumVotingFinishIndexer();
  return isBeforeAhm(indexer) ? relayChainHeight : localHeight;
}
