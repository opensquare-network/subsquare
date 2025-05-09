import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { isNil } from "lodash-es";
import { useScanHeight } from "next-common/hooks/scanHeight";
import { useSelector } from "react-redux";

export default function useChainOrScanHeight() {
  const scanHeight = useScanHeight();
  const chainHeight = useSelector(latestHeightSelector);
  return isNil(chainHeight) ? scanHeight : chainHeight;
}
