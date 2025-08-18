import Tooltip from "./tooltip";
import {
  abbreviateBigNumber,
  getEffectiveNumbers,
  formatVerySmallNumberWithAbbr,
} from "../utils/viewfuncs";
import { cn } from "next-common/utils";
import BigNumber from "bignumber.js";
import NumberWithComma from "next-common/components/numberWithComma";

function MaybeApproximationSymbol({ showApproximationSymbol, isDifferent }) {
  if (showApproximationSymbol && isDifferent) {
    return <span>≈</span>;
  }
  return null;
}

export default function ValueDisplay({
  value,
  symbol,
  showTooltip = true,
  showApproximationSymbol = true,
  className,
  prefix,
  tooltipClassName,
  showVerySmallNumber = false,
  tooltipOtherContent,
}) {
  let tooltipContent = (
    <span>
      <NumberWithComma value={value} symbol={symbol} /> {tooltipOtherContent}
    </span>
  );
  const symbolContent = symbol && (
    <span className={cn("value-display-symbol text-textTertiary", className)}>
      {symbol}
    </span>
  );

  let content = (
    <span className="inline-flex items-center gap-x-1">
      {prefix}
      {Number(value)?.toLocaleString()}
      {symbolContent}
    </span>
  );

  if (showVerySmallNumber && Number(value) < 0.001) {
    const formattedSmallNumber = formatVerySmallNumberWithAbbr(value);
    const bigValue = new BigNumber(value);
    content = (
      <span className="inline-flex items-center gap-x-1">
        {prefix}
        {formattedSmallNumber}
        {symbolContent}
      </span>
    );
    tooltipContent = `${bigValue.toFixed()}${
      symbol ? " " + symbol : ""
    } ${tooltipOtherContent}`;
  } else if (
    Number(value) >= 100000 ||
    getEffectiveNumbers(value)?.length >= 11
  ) {
    const abbreviated = abbreviateBigNumber(value, 2);
    content = (
      <>
        <MaybeApproximationSymbol
          showApproximationSymbol={showApproximationSymbol}
          isDifferent={
            getEffectiveNumbers(abbreviated) !== getEffectiveNumbers(value)
          }
        />
        <span className="inline-flex items-center gap-x-1">
          {prefix}
          {abbreviated}
          {symbolContent}
        </span>
      </>
    );
  } else if (String(value).includes(".")) {
    const [int, decimal] = String(value).split(".");
    if (decimal?.length > 5) {
      const shortDecimal = decimal.substring(0, 5);
      content = (
        <span className="inline-flex items-center gap-x-1">
          {showApproximationSymbol ? <span>≈</span> : null}
          {prefix}
          {int}.{shortDecimal}
          {symbolContent}
        </span>
      );
    }
  }

  let container = (
    <span className={cn("inline-flex items-center gap-x-1", className)}>
      {content}
    </span>
  );

  if (showTooltip) {
    container = (
      <Tooltip content={tooltipContent} className={tooltipClassName}>
        {container}
      </Tooltip>
    );
  }

  return container;
}
