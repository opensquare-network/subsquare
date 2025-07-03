import React from "react";
import VoteBarBarProgress from "next-common/components/referenda/voteBar/barProgress";
import Tooltip from "next-common/components/tooltip";
import styled from "styled-components";
import Flex from "next-common/components/styled/flex";
import ValueDisplay from "next-common/components/valueDisplay";
import { getTallyVotesBarPercent } from "next-common/utils/referendumCommon";
import tw from "tailwind-styled-components";
import { toPrecision } from "next-common/utils";

const VotesSummaryBarWrapper = styled(Flex)`
  width: 25px;
`;
const StyledTooltip = styled(Tooltip)`
  display: flex;
  align-items: center;
`;

const TooltipContent = styled.div`
  > * {
    color: var(--textPrimaryContrast);
  }
`;

const GroupTitle = tw.h4`
  text12Bold
  m-0
`;

const GroupValue = styled(Flex)`
  gap: 4px;
`;

export default function PostVotesSummary({ tally, symbol, decimals }) {
  const ayes = tally?.ayes ?? 0;
  const nays = tally?.nays ?? 0;
  const { ayesPercent, naysPercent } = getTallyVotesBarPercent(tally);

  return (
    <StyledTooltip
      content={
        <TooltipContent>
          <GroupTitle>Aye</GroupTitle>
          <GroupValue>
            <ValueDisplay
              value={toPrecision(ayes, decimals)}
              symbol={symbol}
              showTooltip={false}
            />
            <span>({ayesPercent}%)</span>
          </GroupValue>
          <GroupTitle>Nay</GroupTitle>
          <GroupValue>
            <ValueDisplay
              value={toPrecision(nays, decimals)}
              symbol={symbol}
              showTooltip={false}
            />
            <span>({naysPercent}%)</span>
          </GroupValue>
        </TooltipContent>
      }
    >
      <VotesSummaryBarWrapper>
        <VoteBarBarProgress tally={tally} thin gap={0} />
      </VotesSummaryBarWrapper>
    </StyledTooltip>
  );
}
