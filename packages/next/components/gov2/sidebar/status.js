// bulk of copies from "components/referenda/vote"

import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import styled, { useTheme } from "styled-components";
import Progress from "next-common/components/progress";
import FlexBetween from "next-common/components/styled/flexBetween";
import { p_14_normal } from "next-common/styles/componentCss";
import TooltipOrigin from "next-common/components/tooltip";
import { estimateBlocksTime, estimateRemainBlockTime } from "next-common/utils";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useMemo } from "react";
import { gov2State } from "next-common/utils/consts/state";
import BigNumber from "bignumber.js";

const Wrapper = styled.div``;

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
`;

const Status = styled.div`
  margin-top: 8px !important;
  width: 100%;
  line-height: 38px;
  border-width: 0;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 700;
  cursor: default;
  text-align: center;
`;

const DecidingStatus = styled(Status)`
  color: ${(props) => props.theme.secondaryBlue500};
  background: ${(props) => props.theme.secondaryBlue100};
`;

const PositiveStatus = styled(Status)`
  color: ${(props) => props.theme.secondaryGreen500};
  background: ${(props) => props.theme.secondaryGreen100};
`;

const ProgressInfo = styled(FlexBetween)`
  color: ${(p) => p.theme.textPrimary};
  ${p_14_normal};
`;
const ProgressGroup = styled.div``;

const Tooltip = styled(TooltipOrigin)`
  display: block;
`;

function findDecisionStarted(timeline = []) {
  return timeline.find((item) => ["DecisionStarted"].includes(item.name));
}

// means the latest one always is `ConfirmStarted`
function filterConfirmStartedTimeline(timeline = []) {
  return timeline.filter((item) => ["ConfirmStarted"].includes(item.name));
}

export default function Gov2Status({ detail }) {
  const { secondaryGreen500, secondaryGreen300 } = useTheme();
  const blockTime = useSelector(blockTimeSelector);

  const onchainData = detail?.onchainData ?? {};
  const trackInfo = onchainData?.trackInfo ?? {};
  const state = onchainData.state?.name;
  const decisionPeriod = estimateBlocksTime(
    trackInfo.decisionPeriod,
    blockTime
  );
  const confirmPeriod = estimateBlocksTime(trackInfo.confirmPeriod, blockTime);

  // same logic: `show confirming period`
  const isPositiveState = useMemo(
    () => [gov2State.Confirming, gov2State.Approved].includes(state),
    [state]
  );

  const decisionStartedState = findDecisionStarted(onchainData.timeline);
  const latestConfirmStartedState = filterConfirmStartedTimeline(
    onchainData.timeline
  ).pop();

  const { text: remainDecisionPeriodTime, remainMs: remainDecisionMs } =
    estimateRemainBlockTime(
      trackInfo.decisionPeriod,
      blockTime,
      decisionStartedState?.indexer?.blockTime
    );
  const { text: remainConfirmPeriodTime, remainMs: remainConfirmMs } =
    estimateRemainBlockTime(
      trackInfo.confirmPeriod,
      blockTime,
      latestConfirmStartedState?.indexer?.blockTime
    );

  const decisionPeriodMs = new BigNumber(blockTime)
    .multipliedBy(trackInfo.decisionPeriod)
    .toNumber();
  const confirmPeriodMs = new BigNumber(blockTime)
    .multipliedBy(trackInfo.confirmPeriod)
    .toNumber();

  const decesionPeriodPercentage =
    100 - Math.floor((remainDecisionMs / decisionPeriodMs) * 100);
  const confirmPeriodPercentage =
    100 - Math.floor((remainConfirmMs / confirmPeriodMs) * 100);

  return (
    <Wrapper>
      <SecondaryCardDetail>
        <Title>Status</Title>

        <div>
          <ProgressGroup>
            <Tooltip content={remainDecisionPeriodTime}>
              <Progress percentage={decesionPeriodPercentage} />
            </Tooltip>
            <ProgressInfo>
              <p>Decision Period</p>
              <p>{decisionPeriod.join(" ")}</p>
            </ProgressInfo>
          </ProgressGroup>

          {isPositiveState && (
            <ProgressGroup>
              <Tooltip content={remainConfirmMs > 0 && remainConfirmPeriodTime}>
                <Progress
                  percentage={confirmPeriodPercentage}
                  offsetLeft={35}
                  offsetRight={50}
                  fg={secondaryGreen500}
                  bg={secondaryGreen300}
                />
              </Tooltip>
              <ProgressInfo>
                <p>Confirming Period</p>
                <p>{confirmPeriod.join(" ")}</p>
              </ProgressInfo>
            </ProgressGroup>
          )}
        </div>

        <div>
          {isPositiveState ? (
            <PositiveStatus>{state}</PositiveStatus>
          ) : (
            <DecidingStatus>{state}</DecidingStatus>
          )}
        </div>
      </SecondaryCardDetail>
    </Wrapper>
  );
}
