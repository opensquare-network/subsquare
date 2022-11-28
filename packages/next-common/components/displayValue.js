import React from "react";
import styled from "styled-components";
import Tooltip from "./tooltip";
import { abbreviateBigNumber, getEffectiveNumbers } from "../utils/viewfuncs";

const NotEqual = styled.div`
  ::before {
    content: "≈";
    color: ${(props) => props.theme.textPrimary};
    margin-right: 2px;
  }
`;

export default function ValueDisplay({
  value,
  symbol,
  noWrap,
  showTooltip = true,
}) {
  const tooltipContent = `${value} ${symbol}`;
  const symbolContent = <span className="value-display-symbol"> {symbol}</span>;

  if (isNaN(value) || noWrap) {
    return (
      <span>
        {value}
        {symbolContent}
      </span>
    );
  }

  if (Number(value) >= 100000 || getEffectiveNumbers(value)?.length >= 11) {
    const abbreviated = abbreviateBigNumber(value, 2);
    let display = (
      <span title={!showTooltip && tooltipContent}>
        {abbreviated}
        {symbolContent}
      </span>
    );
    if (getEffectiveNumbers(abbreviated) !== getEffectiveNumbers(value)) {
      display = <NotEqual>{display}</NotEqual>;
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
      <NotEqual>
        <span title={!showTooltip && tooltipContent}>
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
    <div>
      <span>{Number(value)?.toLocaleString()} </span>
      {symbolContent}
    </div>
  );
}
