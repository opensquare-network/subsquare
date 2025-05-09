import { createGlobalState } from "react-use";

const useScanHeightState = createGlobalState(null);

export function useScanHeight() {
  const [scanHeight] = useScanHeightState();
  return scanHeight;
}

export function useSetScanHeight() {
  const [, setScanHeight] = useScanHeightState();
  return setScanHeight;
}
