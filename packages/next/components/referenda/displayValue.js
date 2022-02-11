import styled from "styled-components";

import Tooltip from "next-common/components/tooltip";
import { abbreviateBigNumber } from "utils";

const NotEqual = styled.div`
  ::before {
    content: "≈";
    color: #9da9bb;
    margin-right: 2px;
  }
`;

export default function ValueDisplay({ value, symbol, noWrap }) {
  if (isNaN(value) || noWrap) {
    return `${value} ${symbol}`;
  }
  if (Number(value) >= 1000000) {
    return (
      <Tooltip content={`${value} ${symbol}`}>
        <NotEqual>{`${abbreviateBigNumber(value, 5)} ${symbol}`}</NotEqual>
      </Tooltip>
    );
  }
  const [int, decimal] = String(value).split(".");
  if (decimal?.length > 5) {
    const shortDeciaml = decimal.substring(0, 5);
    return (
      <Tooltip content={`${value} ${symbol}`}>
        <NotEqual>{`${int}.${shortDeciaml} ${symbol}`}</NotEqual>
      </Tooltip>
    );
  }
  return `${value} ${symbol}`;
}
