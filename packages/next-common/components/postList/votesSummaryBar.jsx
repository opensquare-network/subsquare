import React from "react";
import VoteBarBarProgress from "../referenda/voteBar/barProgress";
import Tooltip from "../tooltip";
import styled from "styled-components";
import Flex from "../styled/flex";
import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "../valueDisplay";
import { toPrecision } from "next-common/utils";
import { getTallyVotesBarPercent } from "next-common/utils/referendumCommon";
import businessCategory from "next-common/utils/consts/business/category";
import tw from "tailwind-styled-components";

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

function TypedValueDisplay({ value, type, blockHeight }) {
  const chainSettings = useChainSettings(blockHeight);
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
  const ayes = tally?.ayes ?? 0;
  const nays = tally?.nays ?? 0;
  const { ayesPercent, naysPercent } = getTallyVotesBarPercent(tally);

  return (
    <StyledTooltip
      content={
        <TooltipContent>
          <GroupTitle>Aye</GroupTitle>
          <GroupValue>
            <TypedValueDisplay
              type={type}
              value={ayes}
              blockHeight={data.indexer?.blockHeight}
            />
            <span>({ayesPercent}%)</span>
          </GroupValue>
          <GroupTitle>Nay</GroupTitle>
          <GroupValue>
            <TypedValueDisplay
              type={type}
              value={nays}
              blockHeight={data.indexer?.blockHeight}
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
