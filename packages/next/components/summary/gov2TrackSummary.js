import styled from "styled-components";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { estimateBlocksTime } from "next-common/utils";
import {
  SummaryGreyText,
  SummaryItem,
  SummaryItemTitle,
  SummaryItemWrapper as SummaryItemWrapperOrigin,
} from "next-common/components/summary/styled";
import Delegation from "./delegation";
import Summary from "next-common/components/summary/new";
import Content from "next-common/components/summary/cardContent";
import ThresholdCurvesChart from "next-common/components/charts/thresholdCurve";
import ArrowOutSimpleIcon from "next-common/components/icons/arrowOutSimple";
import { useState } from "react";
import ThresholdCurvesPopup from "next-common/components/charts/thresholdCurve/popup";
import ThresholdCurvesLegend from "next-common/components/charts/thresholdCurve/legend";
import { range } from "next-common/utils/array";

const SummaryContentWrapper = styled.div`
  display: flex;
`;

const SummaryItemWrapper = styled(SummaryItemWrapperOrigin)`
  flex: 2;
  flex-wrap: wrap;

  ${SummaryItem} {
    width: calc(50% - 16px);
    flex: unset;
  }
`;
const SummaryThresholdCurveWrapper = styled.div`
  flex: 1;
`;
const SummaryThresholdCurveItem = styled(SummaryItem)`
  height: 100%;
`;
const SummaryThresholdCurveContent = styled(Content)`
  margin: 8px 0;
  height: 108px;
`;
const SummaryThresholdCurveItemTitle = styled(SummaryItemTitle)`
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${ArrowOutSimpleIcon} {
    cursor: pointer;
  }
`;

export default function Gov2TrackSummary({
  summary,
  period,
  noDelegation = false,
}) {
  const {
    origin,
    description,
    maxDeciding,
    preparePeriod,
    decisionPeriod,
    confirmPeriod,
    id,
  } = period ?? {};

  const [showThresholdCurveDetailPopup, setShowThresholdCurveDetailPopup] =
    useState(false);

  const blockTime = useSelector(blockTimeSelector);
  const preparePeriodBlockTime = estimateBlocksTime(preparePeriod, blockTime);
  const decisionPeriodBlockTime = estimateBlocksTime(decisionPeriod, blockTime);
  const confirmPeriodBlockTime = estimateBlocksTime(confirmPeriod, blockTime);

  const decisionPeriodHrs = Number(decisionPeriodBlockTime[0]) * 24;
  const chartLabels = range(decisionPeriodHrs + 1);
  const supportData = range(chartLabels.length + 1)
    .map((_, idx) => 58 - idx * 0.1)
    .sort((a, b) => b - a);
  const approvalData = range(chartLabels.length + 1)
    .map((_, idx) => 100 - idx * 0.2)
    .sort((a, b) => b - a);

  let footer = null;
  if (!noDelegation) {
    footer = <Delegation trackId={id} />;
  }

  function showThresholdCurveDetail() {
    setShowThresholdCurveDetailPopup(true);
  }

  return (
    <Summary
      title={`Origin: ${origin}`}
      titleExtra={`#${id}`}
      description={description}
      footer={footer}
    >
      <SummaryContentWrapper>
        <SummaryItemWrapper>
          <SummaryItem>
            <SummaryItemTitle>Capacity</SummaryItemTitle>
            <Content>
              <span>
                {summary.decidingCount || 0}
                <SummaryGreyText> / {maxDeciding}</SummaryGreyText>
              </span>
            </Content>
          </SummaryItem>

          <SummaryItem>
            <SummaryItemTitle>Confirm</SummaryItemTitle>
            <Content>
              <span>
                {confirmPeriodBlockTime[0] || 0}
                <SummaryGreyText> {confirmPeriodBlockTime[1]}</SummaryGreyText>
              </span>
            </Content>
          </SummaryItem>

          <SummaryItem>
            <SummaryItemTitle>Prepare Period</SummaryItemTitle>
            <Content>
              <span>
                {preparePeriodBlockTime[0] || 0}
                <SummaryGreyText> {preparePeriodBlockTime[1]}</SummaryGreyText>
              </span>
            </Content>
          </SummaryItem>

          <SummaryItem>
            <SummaryItemTitle>Decision</SummaryItemTitle>
            <Content>
              <span>
                {decisionPeriodBlockTime[0] || 0}
                <SummaryGreyText> {decisionPeriodBlockTime[1]}</SummaryGreyText>
              </span>
            </Content>
          </SummaryItem>

          <SummaryItem>
            <SummaryItemTitle>Total</SummaryItemTitle>
            <Content>
              <span>{summary.total}</span>
            </Content>
          </SummaryItem>
        </SummaryItemWrapper>

        <SummaryThresholdCurveWrapper>
          <SummaryThresholdCurveItem>
            <SummaryThresholdCurveItemTitle>
              <span>Threshold Curves</span>
              <ArrowOutSimpleIcon onClick={showThresholdCurveDetail} />
            </SummaryThresholdCurveItemTitle>
            <SummaryThresholdCurveContent>
              <ThresholdCurvesChart
                height={108}
                scalesX={false}
                scalesY={false}
                labels={chartLabels}
                supportData={supportData}
                approvalData={approvalData}
              />
              <ThresholdCurvesLegend />
            </SummaryThresholdCurveContent>
          </SummaryThresholdCurveItem>
        </SummaryThresholdCurveWrapper>
      </SummaryContentWrapper>

      {showThresholdCurveDetailPopup && (
        <ThresholdCurvesPopup
          labels={chartLabels}
          supportData={supportData}
          approvalData={approvalData}
          setShow={setShowThresholdCurveDetailPopup}
        />
      )}
    </Summary>
  );
}
