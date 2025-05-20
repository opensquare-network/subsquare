import { isAssetHubMigrated } from "next-common/utils/consts/isAssetHubMigrated";
import { useSubRelayScanHeight } from "next-common/hooks/relayScanHeight";

export function RelayScanStatusWrapper({ children, relayScanHeight }) {
  useSubRelayScanHeight(relayScanHeight);
  return children;
}

export default function MaybeSubRelayScanStatus({ relayScanHeight, children }) {
  if (isAssetHubMigrated()) {
    return (
      <RelayScanStatusWrapper relayScanHeight={relayScanHeight}>
        {children}
      </RelayScanStatusWrapper>
    );
  }

  return children;
}
