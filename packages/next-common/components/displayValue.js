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
  if (isNaN(value) || noWrap) {
    return `${value} ${symbol}`;
  }

  if (Number(value) >= 1000000 || getEffectiveNumbers(value)?.length >= 11) {
    const abbreviated = abbreviateBigNumber(value, 2);
    let display = `${abbreviated} ${symbol}`;
    if (getEffectiveNumbers(abbreviated) !== getEffectiveNumbers(value)) {
      display = (
        <NotEqual>
          <span className="figures">{abbreviated}</span>{" "}
          <span className="symbol">{symbol}</span>
        </NotEqual>
      );
    }
    return <Tooltip content={`${value} ${symbol}`}>{display}</Tooltip>;
  }

  const [int, decimal] = String(value).split(".");
  if (decimal?.length > 5) {
    const shortDeciaml = decimal.substring(0, 5);
    return (
      <Tooltip content={`${value} ${symbol}`}>
        <NotEqual>
          <span className="figures">
            {int}.{shortDeciaml}
          </span>{" "}
          <span className="symbol">{symbol}</span>
        </NotEqual>
      </Tooltip>
    );
  }
  return (
    <div>
      <span className="figures">{value}</span>{" "}
      <span className="symbol">{symbol}</span>
    </div>
  );
}
