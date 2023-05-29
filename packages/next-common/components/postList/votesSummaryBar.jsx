import React from "react";
import VoteBarBarProgress from "components/referenda/voteBar/barProgress";
import Tooltip from "../tooltip";
import styled from "styled-components";
import Flex from "../styled/flex";
import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "../valueDisplay";
import { toPrecision } from "next-common/utils";
import { getTallyVotesBarPercent } from "utils/referendumUtil";
import { p_12_bold } from "next-common/styles/componentCss";

const VotesSummaryBarWrapper = styled(Flex)`
  width: 24px;
`;
const StyledTooltip = styled(Tooltip)`
  display: flex;
  align-items: center;
`;

const TooltipContent = styled.div`
  > * {
    color: ${(p) => p.theme.textContrast};
  }
`;

const GroupTitle = styled.h4`
  ${p_12_bold};
  margin: 0;
`;

const GroupValue = styled(Flex)`
  gap: 4px;
`;

export default function PostListCardVotesSummaryBar({ data }) {
  const chainSettings = useChainSettings();
  const symbol = chainSettings.symbol;

  const tally = data.onchainData?.tally ?? data.onchainData?.info?.tally;
  const ayes = tally?.ayes;
  const nays = tally?.nays;
  const { ayesPercent, naysPercent } = getTallyVotesBarPercent(tally);

  return (
    <StyledTooltip
      content={
        <TooltipContent>
          <GroupTitle>Aye</GroupTitle>
          <GroupValue>
            <ValueDisplay
              value={toPrecision(ayes, chainSettings.decimals)}
              symbol={symbol}
              showTooltip={false}
            />
            <span>({ayesPercent}%)</span>
          </GroupValue>
          <GroupTitle>Nay</GroupTitle>
          <GroupValue>
            <ValueDisplay
              value={toPrecision(nays, chainSettings.decimals)}
              symbol={symbol}
              showTooltip={false}
            />
            <span>({naysPercent}%)</span>
          </GroupValue>
        </TooltipContent>
      }
    >
      <VotesSummaryBarWrapper>
        <VoteBarBarProgress tally={tally} thin />
      </VotesSummaryBarWrapper>
    </StyledTooltip>
  );
}
