import { useChainSettings } from "next-common/context/chain";
import { createGlobalState } from "react-use";
import { useSubScanHeightStream } from "../scanHeight/useSubScanHeightStream";
import { useEffect } from "react";

const useRelayHeightState = createGlobalState(null);

export function useRelayChainLatestHeight() {
  const [relayScanHeight] = useRelayHeightState();
  return relayScanHeight + 28800 + 28800;
}

export function useSetRelayHeight() {
  const [, setRelayHeight] = useRelayHeightState();
  return setRelayHeight;
}

export function useSubRelayHeight(relayScanHeight) {
  const { blockTime } = useChainSettings();
  const setRelayHeight = useSetRelayHeight();

  const interval = parseInt(blockTime) || 12000;

  useSubScanHeightStream({
    url: `stream/relay-chain-height?interval=${interval}`,
    timeout: 10 * interval,
    callback: setRelayHeight,
  });

  useEffect(() => {
    if (relayScanHeight) {
      setRelayHeight(relayScanHeight);
    }
  }, [setRelayHeight, relayScanHeight]);
}
