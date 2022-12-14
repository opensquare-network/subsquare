import React from "react";
import styled from "styled-components";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import Flex from "next-common/components/styled/flex";

const Wrapper = styled.div`
  flex-grow: 1;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: ${(p) => p.theme.textTertiary};

  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 4px 12px;
  gap: 8px;
  background: ${(p) => p.theme.grey100Bg};
  border-radius: 4px;

  > :not(:first-child) {
    ::before {
      content: "·";
      margin-right: 8px;
      color: ${(p) => p.theme.textTertiary};
    }
  }
`;

const InfoItem = styled(Flex)`
  gap: 4px;
  > :nth-child(2) {
    color: ${(p) => p.theme.textSecondary};
  }
`;

export default function DemocracySummaryStackInfo({ votingBalance, balance }) {
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
