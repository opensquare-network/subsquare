import { isNil } from "lodash-es";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { useSelector } from "react-redux";
import { createGlobalState } from "react-use";

const useCoretimeScanHeightState = createGlobalState(null);

export function useCoretimeScanHeight() {
  const [scanHeight] = useCoretimeScanHeightState();
  return scanHeight;
}

export function useSetCoretimeScanHeight() {
  const [, setScanHeight] = useCoretimeScanHeightState();
  return setScanHeight;
}

export default function useCoretimeChainOrScanHeight() {
  const scanHeight = useCoretimeScanHeight();
  const chainHeight = useSelector(latestHeightSelector);
  return isNil(chainHeight) ? scanHeight : chainHeight;
}
