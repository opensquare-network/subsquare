import { usePageProperties } from "next-common/context/page";
import { isAssetHubMigrated } from "next-common/utils/consts/isAssetHubMigrated";
import { useSubRelayHeight } from "next-common/hooks/relayScanHeight";

function RelayStatusSubscriber() {
  const { relayScanHeight } = usePageProperties();
  useSubRelayHeight(relayScanHeight);
  return null;
}

export default function MaybeSubRelayStatus({ children }) {
  if (isAssetHubMigrated()) {
    return (
      <>
        {children}
        <RelayStatusSubscriber />
      </>
    );
  }

  return children;
}
