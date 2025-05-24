import { useChainSettings } from "next-common/context/chain";
import { useEffect } from "react";
import { createGlobalState } from "react-use";
import { useSubScanHeightStream } from "./useSubScanHeightStream";

const useScanHeightState = createGlobalState(null);

export function useScanHeight() {
  const [scanHeight] = useScanHeightState();
  return scanHeight;
}

export function useSetScanHeight() {
  const [, setScanHeight] = useScanHeightState();
  return setScanHeight;
}

export function useSubScanHeight(scanHeight) {
  const { blockTime } = useChainSettings();
  const setScanHeight = useSetScanHeight();

  const interval = parseInt(blockTime) || 12000;

  useSubScanHeightStream({
    url: `stream/scan-height?interval=${interval}`,
    timeout: 10 * interval,
    setScanHeight,
  });

  useEffect(() => {
    if (scanHeight) {
      setScanHeight(scanHeight);
    }
  }, [setScanHeight, scanHeight]);
}
