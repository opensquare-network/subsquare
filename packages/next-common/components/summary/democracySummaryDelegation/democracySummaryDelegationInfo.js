import React from "react";
import styled from "styled-components";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import VoteLabel from "next-common/components/democracy/allVotesPopup/voteLabel";
import ValueDisplay from "next-common/components/valueDisplay";
import User from "next-common/components/user";
import { Conviction, ConvictionSupport } from "../../../utils/referendumCommon";
import GreyInfoPanel from "../styled/greyInfoPanel";

const Wrapper = styled(GreyInfoPanel)`
  > :nth-child(3) {
    color: ${(p) => p.theme.textSecondary};
  }

  > :nth-child(4),
  > :nth-child(5) {
    ::before {
      content: "·";
      margin-right: 8px;
    }
    display: inline-flex;
    > :last-child {
      margin-left: 4px;
      color: ${(p) => p.theme.textSecondary};
    }
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
      <ValueDisplay
        value={toPrecision(
          delegating.balance * ConvictionSupport[delegating.conviction],
          node.decimals
        )}
        symbol={node.symbol}
      />
      <div>
        <span>Conviction</span>
        <span>
          <VoteLabel conviction={conviction} />
        </span>
      </div>
      <div>
        <span>Capital</span>
        <ValueDisplay
          value={toPrecision(delegating.balance, node.decimals)}
          symbol={node.symbol}
        />
      </div>
    </Wrapper>
  );
}
