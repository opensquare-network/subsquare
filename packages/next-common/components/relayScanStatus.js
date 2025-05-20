import { useEffect } from "react";
import { useChainSettings } from "next-common/context/chain";
import { useSetRelayScanHeight } from "next-common/hooks/relayScanHeight";
import { useSubScanHeight } from "./scanStatus";

export default function RelayScanStatusComponent({
  children,
  relayScanHeight,
}) {
  const { blockTime } = useChainSettings();
  const setRelayScanHeight = useSetRelayScanHeight();

  const interval = parseInt(blockTime) || 12000;

  useSubScanHeight({
    url: `stream/relay-scan-height?interval=${interval}`,
    timeout: 10 * interval,
    setScanHeight: setRelayScanHeight,
  });

  useEffect(() => {
    if (relayScanHeight) {
      setRelayScanHeight(relayScanHeight);
    }
  }, [setRelayScanHeight, relayScanHeight]);

  return children;
}
