import { memo } from "react";
import styled from "styled-components";
import Flex from "next-common/components/styled/flex";
import {
  getThresholdOfSimplyMajority,
  getThresholdOfSuperMajorityAgainst,
  getThresholdOfSuperMajorityApprove,
} from "next-common/utils/referendumUtil";
import Threshold from "../threshold";
import { isNil } from "lodash-es";
import VoteBarBarProgress from "./barProgress";
import { getTallyVotesBarPercent } from "next-common/utils/referendumCommon";
import tw from "tailwind-styled-components";
import Tooltip from "next-common/components/tooltip";

const Wrapper = styled.div``;

const ContentVoteBarInfoGroup = styled.div`
  margin-top: 4px;
  margin-bottom: 16px;
`;
const ContentGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;
const ContentPercentage = tw.span`
  text12Medium text-textPrimary
`;
const ContentDescription = tw.span`
  text12Medium text-textSecondary
`;
const ContentAyeGroup = styled(ContentGroup)`
  text-align: left;
`;
const ContentThresholdGroup = styled(ContentGroup)`
  text-align: center;
  white-space: nowrap;
`;
const ContentNayGroup = styled(ContentGroup)`
  text-align: right;
`;

function VoteBar({ tally, electorate, threshold, percentage, thin = false }) {
  const turnout = tally?.turnout ?? 0;
  const { ayesPercent, naysPercent } = getTallyVotesBarPercent(tally);

  const percentageStr = `${(percentage * 100).toFixed(1)}%`;

  return (
    <Wrapper>
      <VoteBarBarProgress tally={tally} thin={thin}>
        {(threshold || "").toLowerCase() === "simplemajority" && (
          <Threshold thin={thin} threshold={getThresholdOfSimplyMajority()} />
        )}

        {(threshold || "").toLowerCase() === "supermajorityapprove" && (
          <Threshold
            thin={thin}
            threshold={getThresholdOfSuperMajorityApprove(turnout, electorate)}
          />
        )}

        {(threshold || "").toLowerCase() === "supermajorityagainst" && (
          <Threshold
            thin={thin}
            threshold={getThresholdOfSuperMajorityAgainst(turnout, electorate)}
          />
        )}

        {threshold === "percentage" && !isNil(percentage) && (
          <Threshold threshold={percentageStr} />
        )}
      </VoteBarBarProgress>

      <ContentVoteBarInfoGroup>
        <Flex>
          <ContentAyeGroup>
            <ContentPercentage>{ayesPercent}%</ContentPercentage>
            <ContentDescription>Aye</ContentDescription>
          </ContentAyeGroup>
          <Tooltip
            className="cursor-pointer"
            contentClassName="max-w-[240px]"
            content="The minimum percentage of approval required for the proposal to pass."
          >
            <ContentThresholdGroup>
              <ContentPercentage>
                {threshold === "percentage" && !isNil(percentage) && (
                  <span>{percentageStr}</span>
                )}
                {threshold && threshold !== "percentage" && (
                  <span>Passing threshold</span>
                )}
              </ContentPercentage>
              <ContentDescription>
                {threshold === "percentage" && !isNil(percentage) && (
                  <span>Threshold</span>
                )}
                {threshold && threshold !== "percentage" && (
                  <span>{threshold}</span>
                )}
              </ContentDescription>
            </ContentThresholdGroup>
          </Tooltip>

          <ContentNayGroup>
            <ContentPercentage>{naysPercent}%</ContentPercentage>
            <ContentDescription>Nay</ContentDescription>
          </ContentNayGroup>
        </Flex>
      </ContentVoteBarInfoGroup>
    </Wrapper>
  );
}

export default memo(VoteBar);
