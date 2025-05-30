import { isAssetHubMigrated } from "next-common/utils/consts/isAssetHubMigrated";
import { useSubRelayHeight } from "next-common/hooks/relayScanHeight";

export function RelayStatusWrapper({ children, relayScanHeight }) {
  useSubRelayHeight(relayScanHeight);
  return children;
}

export default function MaybeSubRelayStatus({ relayScanHeight, children }) {
  if (isAssetHubMigrated()) {
    return (
      <RelayStatusWrapper relayScanHeight={relayScanHeight}>
        {children}
      </RelayStatusWrapper>
    );
  }

  return children;
}
