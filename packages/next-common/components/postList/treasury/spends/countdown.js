import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useSelector } from "react-redux";
import { isNil } from "lodash-es";
import TooltipCountdown from "next-common/components/postList/common/tooltipCountdown";

export default function TreasurySpendsCountDown({ data = {} }) {
  const { meta, state, indexer } = data || {};
  const { expireAt, validFrom } = meta || {};
  const latestHeight = useSelector(chainOrScanHeightSelector);

  if (
    isNil(expireAt) ||
    isNil(latestHeight) ||
    isNil(validFrom) ||
    isNil(indexer?.blockHeight) ||
    latestHeight >= expireAt ||
    ["Paid", "Processed"].includes(state)
  ) {
    return null;
  }

  if (latestHeight < validFrom) {
    return (
      <TooltipCountdown
        start={indexer.blockHeight}
        end={validFrom}
        now={latestHeight}
        tooltipPrefix="Valid"
      />
    );
  } else {
    return (
      <TooltipCountdown
        start={validFrom}
        end={expireAt}
        now={latestHeight}
        tooltipPrefix="Expire"
      />
    );
  }
}
