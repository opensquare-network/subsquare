import React from "react";
import styled from "styled-components";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import VoteLabel from "next-common/components/democracy/allVotesPopup/voteLabel";
import ValueDisplay from "next-common/components/displayValue";
import User from "next-common/components/user";
import { Conviction } from "../../utils/referendumCommon";

const Wrapper = styled.div`
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

  > :nth-child(3),
  > :nth-child(4) {
    ::before {
      content: "·";
      margin-right: 8px;
      color: ${(p) => p.theme.textTertiary};
    }
    color: ${(p) => p.theme.textSecondary};
  }
`;

export default function DemocracySummaryDelegationInfo({ delegating }) {
  const node = useChainSettings();
  if (!delegating) {
    return <div />;
  }

  const conviction = Conviction[delegating.conviction];

  return (
    <Wrapper>
      <span>Delegating to</span>
      <User add={delegating.target} />
      <span>
        <VoteLabel conviction={conviction} />
      </span>
      <ValueDisplay
        value={toPrecision(delegating.balance, node.decimals)}
        symbol={node.symbol}
      />
    </Wrapper>
  );
}
