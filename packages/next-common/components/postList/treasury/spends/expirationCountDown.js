import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useSelector } from "react-redux";
import { isNil } from "lodash-es";
import TooltipCountdown from "next-common/components/postList/common/tooltipCountdown";

export default function TreasurySpendExpirationCountdown({ data = {} }) {
  const { meta, state } = data || {};
  const { expireAt, validFrom } = meta || {};
  const latestHeight = useSelector(chainOrScanHeightSelector);

  if (
    isNil(expireAt) ||
    isNil(latestHeight) ||
    isNil(validFrom) ||
    latestHeight >= expireAt ||
    ["Paid", "Processed"].includes(state)
  ) {
    return null;
  }

  return (
    <TooltipCountdown start={validFrom} end={expireAt} now={latestHeight} />
  );
}
