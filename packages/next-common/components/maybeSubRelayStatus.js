import { isAssetHubMigrated } from "next-common/utils/consts/isAssetHubMigrated";
import { useSubRelayHeight } from "next-common/hooks/relayScanHeight";

function RelayStatusSubscriber({ relayScanHeight }) {
  useSubRelayHeight(relayScanHeight);
  return null;
}

export default function MaybeSubRelayStatus({ relayScanHeight, children }) {
  if (isAssetHubMigrated()) {
    return (
      <>
        {children}
        <RelayStatusSubscriber relayScanHeight={relayScanHeight} />
      </>
    );
  }

  return children;
}
