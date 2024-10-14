import { useSelector } from "react-redux";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useEstimateBlocksTime } from "next-common/utils/hooks";

export default function Expiration({ unlockAt }) {
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const estimatedBlocksTime = useEstimateBlocksTime(
    Math.abs(unlockAt - latestHeight),
  );

  return (
    <span className="text14Medium text-textTertiary">
      {estimatedBlocksTime}
    </span>
  );
}
