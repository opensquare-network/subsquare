import React from "react";
import VoteBarBarProgress from "../referenda/voteBar/barProgress";
import Tooltip from "../tooltip";
import styled from "styled-components";
import Flex from "../styled/flex";
import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "../valueDisplay";
import { toPrecision } from "next-common/utils";
import { getTallyVotesBarPercent } from "next-common/utils/referendumCommon";
import { p_12_bold } from "next-common/styles/componentCss";
import businessCategory from "next-common/utils/consts/business/category";

const VotesSummaryBarWrapper = styled(Flex)`
  width: 25px;
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

function TypedValueDisplay({ value, type }) {
  const chainSettings = useChainSettings();
  const symbol = chainSettings.symbol;

  let valueDisplayProps = {};
  if (type === businessCategory.fellowship) {
    valueDisplayProps = {
      value,
    };
  } else {
    valueDisplayProps = {
      value: toPrecision(value, chainSettings.decimals),
      symbol,
    };
  }

  return <ValueDisplay {...valueDisplayProps} showTooltip={false} />;
}

export default function PostListCardVotesSummaryBar({ data, type }) {
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
            <TypedValueDisplay type={type} value={ayes} />
            <span>({ayesPercent}%)</span>
          </GroupValue>
          <GroupTitle>Nay</GroupTitle>
          <GroupValue>
            <TypedValueDisplay type={type} value={nays} />
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
