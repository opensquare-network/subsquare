import React from "react";
import styled from "styled-components";
import Tooltip from "./tooltip";
import { abbreviateBigNumber, getEffectiveNumbers } from "../utils/viewfuncs";
import { cn } from "next-common/utils";

const NotEqual = styled.div`
  ::before {
    content: "≈";
    margin-right: 2px;
  }
`;

export default function ValueDisplay({
  value,
  symbol,
  noWrap,
  showTooltip = true,
  className,
}) {
  const tooltipContent = `${value} ${symbol}`;
  const symbolContent = <span className="value-display-symbol"> {symbol}</span>;

  if (isNaN(value) || noWrap) {
    return (
      <div className={cn("inline-flex items-center", className)}>
        <span>
          {value}
          {symbolContent}
        </span>
      </div>
    );
  }

  if (Number(value) >= 100000 || getEffectiveNumbers(value)?.length >= 11) {
    const abbreviated = abbreviateBigNumber(value, 2);
    let display = (
      <span title={showTooltip ? "" : tooltipContent} className={className}>
        {abbreviated}
        {symbolContent}
      </span>
    );
    if (getEffectiveNumbers(abbreviated) !== getEffectiveNumbers(value)) {
      display = (
        <NotEqual className={cn("inline-flex items-center", className)}>
          {display}
        </NotEqual>
      );
    }

    if (showTooltip) {
      display = <Tooltip content={tooltipContent}>{display}</Tooltip>;
    }

    return display;
  }

  const [int, decimal] = String(value).split(".");
  if (decimal?.length > 5) {
    const shortDecimal = decimal.substring(0, 5);
    let display = (
      <NotEqual className={cn("inline-flex items-center", className)}>
        <span title={showTooltip ? "" : tooltipContent}>
          {int}.{shortDecimal}
          {symbolContent}
        </span>
      </NotEqual>
    );

    if (showTooltip) {
      display = <Tooltip content={tooltipContent}>{display}</Tooltip>;
    }

    return display;
  }

  return (
    <div className={cn("inline-flex items-center", className)}>
      <span>{Number(value)?.toLocaleString()}&nbsp;</span>
      {symbolContent}
    </div>
  );
}
