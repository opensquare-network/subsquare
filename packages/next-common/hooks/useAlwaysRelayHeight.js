import { isAssetHubMigrated } from "next-common/utils/consts/isAssetHubMigrated";
import { useRelayChainLatestHeight } from "./relayScanHeight";
import { useScanHeight } from "./scanHeight";

export default function useAlwaysRelayHeight() {
  const relayChainHeight = useRelayChainLatestHeight();
  const scanHeight = useScanHeight();
  return isAssetHubMigrated() ? relayChainHeight : scanHeight;
}
