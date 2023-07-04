import React from "react";
import styled from "styled-components";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import Flex from "next-common/components/styled/flex";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";

const Wrapper = styled(GreyPanel)`
  flex-grow: 1;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: var(--textTertiary);

  flex-wrap: wrap;
  padding: 4px 12px;
  gap: 8px;

  > :not(:first-child) {
    ::before {
      content: "·";
      margin-right: 8px;
      color: var(--textTertiary);
    }
  }
`;

const InfoItem = styled(Flex)`
  gap: 4px;
  > :nth-child(2) {
    color: var(--textSecondary);
  }
`;

export default function DemocracySummaryStakeInfo({ votingBalance, balance }) {
  const node = useChainSettings();

  return (
    <Wrapper>
      <InfoItem>
        <span>{node.voteSymbol} Balance</span>
        <ValueDisplay
          value={toPrecision(votingBalance || 0, node.decimals)}
          symbol={node.voteSymbol}
        />
      </InfoItem>
      <InfoItem>
        <span>Staked {node.symbol}</span>
        <ValueDisplay
          value={toPrecision(balance || 0, node.decimals)}
          symbol={node.symbol}
        />
      </InfoItem>
    </Wrapper>
  );
}
