import { memo } from "react";
import BigNumber from "bignumber.js";
import styled, { css } from "styled-components";
import Flex from "next-common/components/styled/flex";
import {
  getThresholdOfSimplyMajority,
  getThresholdOfSuperMajorityAgainst,
  getThresholdOfSuperMajorityApprove,
} from "utils/referendumUtil";
import Threshold from "../threshold";
import isNil from "lodash.isnil";
import { p_12_medium } from "next-common/styles/componentCss";

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
const ContentPercentage = styled.span`
  color: ${(props) => props.theme.textPrimary};
  ${p_12_medium};
`;
const ContentDescription = styled.span`
  color: ${(props) => props.theme.textSecondary};
  ${p_12_medium};
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

const BarWrapper = styled.div`
  position: relative;
  padding: 8px 0;
`;

const BarContainer = styled.div`
  display: flex;
  gap: ${(p) => p.gap}px;
  height: 8px;
  ${(p) =>
    p.thin &&
    css`
      height: 4px;
    `}
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
`;

const AyesBar = styled.div`
  background-color: ${(props) => props.theme.secondaryGreen500};
  width: ${(p) => p.precent}%;
  height: 100%;
`;

const NaysBar = styled.div`
  background-color: ${(props) => props.theme.secondaryRed500};
  width: ${(p) => p.precent}%;
  height: 100%;
`;

function VoteBar({ tally, electorate, threshold, percentage, thin = false }) {
  const ayes = tally?.ayes ?? 0;
  const nays = tally?.nays ?? 0;
  const turnout = tally?.turnout ?? 0;

  let ayesPercent = 50;
  let naysPercent = 50;
  let gap = 2;
  const nTotal = new BigNumber(ayes).plus(nays);
  if (nTotal.gt(0)) {
    ayesPercent = Math.round(new BigNumber(ayes).div(nTotal).toNumber() * 100);
    naysPercent = 100 - ayesPercent;
    if (ayesPercent === 100 || naysPercent === 100) {
      gap = 0;
    }
  }

  const percentageStr = `${(percentage * 100).toFixed(1)}%`;

  return (
    <Wrapper>
      <BarWrapper>
        <BarContainer thin={thin} gap={gap}>
          <AyesBar precent={ayesPercent} />
          <NaysBar precent={naysPercent} />

          {(threshold || "").toLowerCase() === "simplemajority" && (
            <Threshold thin={thin} threshold={getThresholdOfSimplyMajority()} />
          )}

          {(threshold || "").toLowerCase() === "supermajorityapprove" && (
            <Threshold
              thin={thin}
              threshold={getThresholdOfSuperMajorityApprove(
                turnout,
                electorate,
              )}
            />
          )}

          {(threshold || "").toLowerCase() === "supermajorityagainst" && (
            <Threshold
              thin={thin}
              threshold={getThresholdOfSuperMajorityAgainst(
                turnout,
                electorate,
              )}
            />
          )}

          {threshold === "percentage" && !isNil(percentage) && (
            <Threshold threshold={percentageStr} />
          )}
        </BarContainer>
      </BarWrapper>

      <ContentVoteBarInfoGroup>
        <Flex>
          <ContentAyeGroup>
            <ContentPercentage>{ayesPercent}%</ContentPercentage>
            <ContentDescription>Aye</ContentDescription>
          </ContentAyeGroup>

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
