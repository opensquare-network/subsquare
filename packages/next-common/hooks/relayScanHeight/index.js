import { useChainSettings } from "next-common/context/chain";
import { createGlobalState } from "react-use";
import { useSubScanHeightStream } from "../scanHeight/useSubScanHeightStream";
import { useEffect } from "react";

const useRelayScanHeightState = createGlobalState(null);

export function useRelayScanHeight() {
  const [relayScanHeight] = useRelayScanHeightState();
  return relayScanHeight;
}

export function useSetRelayScanHeight() {
  const [, setRelayScanHeight] = useRelayScanHeightState();
  return setRelayScanHeight;
}

export function useSubRelayScanHeight(relayScanHeight) {
  const { blockTime } = useChainSettings();
  const setRelayScanHeight = useSetRelayScanHeight();

  const interval = parseInt(blockTime) || 12000;

  useSubScanHeightStream({
    url: `stream/relay-scan-height?interval=${interval}`,
    timeout: 10 * interval,
    setScanHeight: setRelayScanHeight,
  });

  useEffect(() => {
    if (relayScanHeight) {
      setRelayScanHeight(relayScanHeight);
    }
  }, [setRelayScanHeight, relayScanHeight]);
}
