import { useChainSettings } from "next-common/context/chain";
import { useEffect } from "react";
import { createGlobalState } from "react-use";
import { useSubScanHeightStream } from "next-common/hooks/scanHeight/useSubScanHeightStream";

const useCoretimeScanHeightState = createGlobalState(null);

export function useCoretimeScanHeight() {
  const [coretimeScanHeight] = useCoretimeScanHeightState();
  return coretimeScanHeight;
}

export function useSetCoretimeScanHeight() {
  const [, setCoretimeScanHeight] = useCoretimeScanHeightState();
  return setCoretimeScanHeight;
}

export function useSubCoretimeScanHeight(coretimeScanHeight) {
  const { blockTime } = useChainSettings();
  const setCoretimeScanHeight = useSetCoretimeScanHeight();

  const interval = parseInt(blockTime) || 12000;

  useSubScanHeightStream({
    url: `stream/coretime-chain-height?interval=${interval}`,
    timeout: 10 * interval,
    callback: setCoretimeScanHeight,
  });

  useEffect(() => {
    if (coretimeScanHeight) {
      setCoretimeScanHeight(coretimeScanHeight);
    }
  }, [setCoretimeScanHeight, coretimeScanHeight]);
}
