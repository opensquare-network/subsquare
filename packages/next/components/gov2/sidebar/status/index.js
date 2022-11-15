// bulk of copies from "components/referenda/vote"

import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import styled, { useTheme } from "styled-components";
import Progress from "next-common/components/progress";
import FlexBetween from "next-common/components/styled/flexBetween";
import { p_14_normal } from "next-common/styles/componentCss";
import TooltipOrigin from "next-common/components/tooltip";
import { estimateRemainBlockTime } from "next-common/utils";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useMemo } from "react";
import { gov2State } from "next-common/utils/consts/state";
import BigNumber from "bignumber.js";
import Status from "./status";
import { usePostState } from "next-common/context/post";
import {
  useConfirmTime,
  useDecisionTime,
  useTrack,
} from "next-common/context/post/gov2/track";
import useDecisionPercentage from "./useDecisionPercentage";
import useConfirmPercentage from "./useConfirmPercentage";

const Wrapper = styled.div``;

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
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

function findConfirmed(timeline = []) {
  return timeline.find((item) => ["Confirmed"].includes(item.name));
}

// means the latest one always is `ConfirmStarted`
function filterConfirmStartedTimeline(timeline = []) {
  return timeline.filter((item) => ["ConfirmStarted"].includes(item.name));
}

export default function Gov2Status({ detail }) {
  const { secondaryGreen500, secondaryGreen300 } = useTheme();
  const blockTime = useSelector(blockTimeSelector);

  const onchainData = detail?.onchainData ?? {};
  const trackInfo = useTrack();
  const state = usePostState();
  const decisionTime = useDecisionTime();
  const confirmTime = useConfirmTime();

  // same logic: `show confirming period`
  const isPositiveState = useMemo(
    () =>
      [gov2State.Confirming, gov2State.Approved, gov2State.Executed].includes(
        state
      ),
    [state]
  );

  const decisionStartedState = findDecisionStarted(onchainData.timeline);
  const confirmedState = findConfirmed(onchainData.timeline);
  const latestConfirmStartedState = filterConfirmStartedTimeline(
    onchainData.timeline
  ).pop();

  const confirmPeriodMs = new BigNumber(blockTime)
    .multipliedBy(trackInfo.confirmPeriod)
    .toNumber();

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
      // if has `Confirmed` state, then remain start time
      // is confirm period time
      confirmedState
        ? confirmPeriodMs
        : latestConfirmStartedState?.indexer?.blockTime
    );

  const decisionPercentage = useDecisionPercentage();
  const confirmPercentage = useConfirmPercentage();

  return (
    <Wrapper>
      <SecondaryCardDetail>
        <Title>Status</Title>

        <div>
          <ProgressGroup>
            <Tooltip content={remainDecisionMs > 0 && remainDecisionPeriodTime}>
              <Progress percentage={decisionPercentage} />
            </Tooltip>
            <ProgressInfo>
              <p>Decision Period</p>
              <p>{decisionTime}</p>
            </ProgressInfo>
          </ProgressGroup>

          {isPositiveState && (
            <ProgressGroup>
              <Tooltip content={remainConfirmMs > 0 && remainConfirmPeriodTime}>
                <Progress
                  percentage={confirmPercentage}
                  offsetLeft={35}
                  offsetRight={50}
                  fg={secondaryGreen500}
                  bg={secondaryGreen300}
                />
              </Tooltip>
              <ProgressInfo>
                <p>Confirming Period</p>
                <p>{confirmTime}</p>
              </ProgressInfo>
            </ProgressGroup>
          )}
        </div>

        <Status state={state} />
      </SecondaryCardDetail>
    </Wrapper>
  );
}
