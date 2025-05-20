import { createGlobalState } from "react-use";

const useRelayScanHeightState = createGlobalState(null);

export function useRelayScanHeight() {
  const [relayScanHeight] = useRelayScanHeightState();
  return relayScanHeight;
}

export function useSetRelayScanHeight() {
  const [, setRelayScanHeight] = useRelayScanHeightState();
  return setRelayScanHeight;
}
