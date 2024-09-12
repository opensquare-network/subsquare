import Tooltip from "./tooltip";
import { abbreviateBigNumber, getEffectiveNumbers } from "../utils/viewfuncs";
import { cn } from "next-common/utils";

export default function ValueDisplay({
  value,
  symbol,
  showTooltip = true,
  showApproximationSymbol = true,
  className,
  prefix,
}) {
  const tooltipContent = `${value}${symbol ? " " + symbol : ""}`;
  const symbolContent = symbol && (
    <span className={cn("value-display-symbol text-textTertiary", className)}>
      {symbol}
    </span>
  );
  const prefixContent = prefix ? prefix : null;

  let content = (
    <>
      {prefixContent}
      {Number(value)?.toLocaleString()}
      {symbolContent}
    </>
  );

  if (Number(value) >= 100000 || getEffectiveNumbers(value)?.length >= 11) {
    const abbreviated = abbreviateBigNumber(value, 2);
    content = (
      <>
        {showApproximationSymbol &&
          getEffectiveNumbers(abbreviated) !== getEffectiveNumbers(value) && (
            <span>≈</span>
          )}
        {prefixContent}
        {abbreviated}
        {symbolContent}
      </>
    );
  } else if (String(value).includes(".")) {
    const [int, decimal] = String(value).split(".");
    if (decimal?.length > 5) {
      const shortDecimal = decimal.substring(0, 5);
      content = (
        <>
          {showApproximationSymbol && <span>≈</span>}
          {prefixContent}
          {int}.{shortDecimal}
          {symbolContent}
        </>
      );
    }
  }

  let container = (
    <span className={cn("inline-flex items-center gap-x-1", className)}>
      {content}
    </span>
  );

  if (showTooltip) {
    container = <Tooltip content={tooltipContent}>{container}</Tooltip>;
  }

  return container;
}
