import { useMemo } from "react";
import { usePageProperties } from "next-common/context/page";
import { useSubRelayHeight } from "next-common/hooks/relayScanHeight";
import { useSubCoretimeScanHeight } from "next-common/hooks/coretimeScanHeight";
import { isAssetHubMigrated } from "next-common/utils/consts/isAssetHubMigrated";
import { isCoretimeChain } from "next-common/utils/chain";
import { useChain } from "next-common/context/chain";

export function RelayStatusSubscriber() {
  const { relayScanHeight } = usePageProperties();
  useSubRelayHeight(relayScanHeight);
  return null;
}

export function CoretimeStatusSubscriber() {
  const { coretimeScanHeight } = usePageProperties();
  useSubCoretimeScanHeight(coretimeScanHeight);
  return null;
}

export default function BaseInitSubscribers() {
  const chain = useChain();

  const subscribers = useMemo(() => {
    const subscribers = [];
    if (isAssetHubMigrated() || isCoretimeChain(chain)) {
      subscribers.push(<RelayStatusSubscriber key="relay-status-subscriber" />);
    }
    if (isCoretimeChain(chain)) {
      subscribers.push(
        <CoretimeStatusSubscriber key="coretime-status-subscriber" />,
      );
    }
    return subscribers;
  }, [chain]);

  if (!subscribers?.length) {
    return null;
  }

  return subscribers;
}
