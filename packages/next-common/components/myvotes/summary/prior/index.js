import styled from "styled-components";
import { useChainSettings } from "next-common/context/chain";
import { isNil } from "lodash-es";
import useChainOrScanHeight from "next-common/hooks/height";
import BigNumber from "bignumber.js";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import Tooltip from "next-common/components/tooltip";
import React from "react";
import { toPrecision } from "next-common/utils";

const PriorBalance = styled.p`
  background: var(--neutral200);
  color: var(--textSecondary);
  padding: 2px 8px;
  border-radius: 4px;
  margin-top: 4px;
`;

const Expiration = styled.span`
  &::before {
    color: var(--textTertiary);
    content: "•";
    font-weight: lighter;
    margin-left: 8px;
  }
`;

export default function PriorInfo({ prior }) {
  const { unlockAt, balance } = prior || {};
  const latestHeight = useChainOrScanHeight();
  const estimatedBlocksTime = useEstimateBlocksTime(
    Math.abs(unlockAt - latestHeight),
  );
  const { symbol, decimals } = useChainSettings();

  if (isNil(unlockAt) || isNil(balance)) {
    return null;
  }

  if (unlockAt <= latestHeight || new BigNumber(balance || 0).lte(0)) {
    return null;
  }

  return (
    <section className="mt-1 !ml-0 text12Medium">
      <h6 className="text-textTertiary flex gap-1">
        Prior Lock
        <Tooltip content="Lock by previous votes" />
      </h6>
      <PriorBalance>
        <span>
          {Number(toPrecision(balance, decimals))?.toLocaleString()}&nbsp;
          {symbol}
        </span>
        <Expiration>
          <span className="text-textTertiary">Expired in&nbsp;</span>
          {estimatedBlocksTime}
        </Expiration>
      </PriorBalance>
    </section>
  );
}
