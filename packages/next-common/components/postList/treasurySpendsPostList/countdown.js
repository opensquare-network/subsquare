import useChainOrScanHeight from "next-common/hooks/height";
import { isNil } from "lodash-es";
import TooltipCountdown from "next-common/components/postList/common/tooltipCountdown";

export default function TreasurySpendsCountDown({ data = {} }) {
  const { meta, state, indexer } = data || {};
  const { expireAt, validFrom } = meta || {};
  const latestHeight = useChainOrScanHeight();

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
