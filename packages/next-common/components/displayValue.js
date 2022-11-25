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

export default function ValueDisplay({ value, symbol, noWrap }) {
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
      <span>
        {abbreviated}
        {symbolContent}
      </span>
    );
    if (getEffectiveNumbers(abbreviated) !== getEffectiveNumbers(value)) {
      display = (
        <NotEqual>
          <span>{abbreviated}</span>
          {symbolContent}
        </NotEqual>
      );
    }
    return <Tooltip content={`${value} ${symbol}`}>{display}</Tooltip>;
  }

  const [int, decimal] = String(value).split(".");
  if (decimal?.length > 5) {
    const shortDecimal = decimal.substring(0, 5);
    return (
      <Tooltip content={`${value} ${symbol}`}>
        <NotEqual>
          <span>
            {int}.{shortDecimal}
          </span>
          {symbolContent}
        </NotEqual>
      </Tooltip>
    );
  }

  return (
    <div>
      <span>{Number(value)?.toLocaleString()} </span>
      {symbolContent}
    </div>
  );
}
