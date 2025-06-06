import { useRelayChainLatestHeight } from "next-common/hooks/relayScanHeight";
import useChainOrScanHeight from "next-common/hooks/height";
import { isAssetHubMigrated } from "next-common/utils/consts/isAssetHubMigrated";

export default function useAhmLatestHeight() {
  const relayChainHeight = useRelayChainLatestHeight();
  const localHeight = useChainOrScanHeight();
  return isAssetHubMigrated() ? relayChainHeight : localHeight;
}
