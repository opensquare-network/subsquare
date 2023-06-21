import styled, { css } from "styled-components";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { estimateBlocksTime, toPrecision } from "next-common/utils";
import {
  SummaryGreyText,
  SummaryItem,
  SummaryItemTitle,
} from "next-common/components/summary/styled";
import Delegation from "./delegation";
import BeenDelegated from "./beenDelegated";
import Summary from "next-common/components/summary/v2/base";
import Content from "next-common/components/summary/cardContent";
import ThresholdCurvesChart from "next-common/components/charts/thresholdCurve";
import ArrowOutSimpleIcon from "next-common/components/icons/arrowOutSimple";
import { useState } from "react";
import ThresholdCurvesPopup from "next-common/components/charts/thresholdCurve/popup";
import ThresholdCurvesGov2TrackSummaryLegend from "next-common/components/charts/thresholdCurve/legend/gov2TrackSummaryLegend";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { smcss } from "next-common/utils/responsive";
import DividerOrigin from "next-common/components/styled/layout/divider";
import useGov2ThresholdCurveData from "next-common/utils/hooks/useGov2ThresholdCurveData";
import FlexCenter from "next-common/components/styled/flexCenter";
import VStack from "next-common/components/styled/vStack";
import Flex from "next-common/components/styled/flex";

// used in `Divider` and `ThresholdCurvesChart`
const THRESHOLD_CURVE_PADDING = 8;

const SummaryThresholdCurveWrapper = styled.div`
  flex: 1;

  ${smcss(css`
    margin-top: 16px;
  `)}
`;
const SummaryThresholdCurveItem = styled(SummaryItem)`
  height: 100%;
`;
const SummaryThresholdCurveContent = styled(Content)`
  margin: 0 -6px;
`;
const SummaryThresholdCurveLegendWrapper = styled(FlexCenter)`
  margin-top: 8px;
`;
const SummaryThresholdCurveItemTitle = styled(SummaryItemTitle)`
  display: flex;
  justify-content: space-between;

  ${ArrowOutSimpleIcon} {
    cursor: pointer;
  }
`;
const SummaryDecisionDepositValueWrapper = styled.span`
  .value-display-symbol {
    color: var(--textTertiary);
  }
`;

const Divider = styled(DividerOrigin)`
  margin-top: ${0 - THRESHOLD_CURVE_PADDING}px;
  margin-right: ${THRESHOLD_CURVE_PADDING}px;
  ${smcss(`
    margin-right: ${4 + THRESHOLD_CURVE_PADDING}px;
  `)}
`;

const TitleWrapper = styled(Flex)`
  > span {
    margin-left: 8px;
  }
`;

export default function Gov2TrackSummary({
  summary,
  period,
  noDelegation = false,
}) {
  const {
    maxDeciding,
    preparePeriod,
    decisionPeriod,
    confirmPeriod,
    id,
    decisionDeposit,
    minEnactmentPeriod,
  } = period ?? {};

  const {
    labels: chartLabels,
    supportData,
    approvalData,
  } = useGov2ThresholdCurveData(period);

  const { decimals, symbol } = useChainSettings();

  const [showThresholdCurveDetailPopup, setShowThresholdCurveDetailPopup] =
    useState(false);

  const blockTime = useSelector(blockTimeSelector);
  const preparePeriodBlockTime = estimateBlocksTime(preparePeriod, blockTime);
  const decisionPeriodBlockTime = estimateBlocksTime(decisionPeriod, blockTime);
  const confirmPeriodBlockTime = estimateBlocksTime(confirmPeriod, blockTime);
  const minEnactPeriodBlockTime = estimateBlocksTime(
    minEnactmentPeriod,
    blockTime,
  );

  let footer = null;
  if (!noDelegation) {
    footer = (
      <VStack space={8}>
        <Delegation trackId={id} />
        <BeenDelegated trackId={id} />
      </VStack>
    );
  }

  function showThresholdCurveDetail() {
    setShowThresholdCurveDetailPopup(true);
  }

  return (
    <>
      <Summary
        footer={footer}
        items={[
          {
            title: "Capacity",
            content: (
              <span>
                {summary.decidingCount || 0}
                <SummaryGreyText> / {maxDeciding}</SummaryGreyText>
              </span>
            ),
          },
          {
            title: "Confirm Period",
            content: (
              <span>
                {confirmPeriodBlockTime[0] || 0}
                <SummaryGreyText> {confirmPeriodBlockTime[1]}</SummaryGreyText>
              </span>
            ),
          },
          {
            title: "Prepare Period",
            content: (
              <span>
                {preparePeriodBlockTime[0] || 0}
                <SummaryGreyText> {preparePeriodBlockTime[1]}</SummaryGreyText>
              </span>
            ),
          },
          {
            title: "Decision Period",
            content: (
              <span>
                {decisionPeriodBlockTime[0] || 0}
                <SummaryGreyText> {decisionPeriodBlockTime[1]}</SummaryGreyText>
              </span>
            ),
          },
          {
            title: "Min Enact Period",
            content: (
              <span>
                {minEnactPeriodBlockTime[0] || 0}
                <SummaryGreyText> {minEnactPeriodBlockTime[1]}</SummaryGreyText>
              </span>
            ),
          },
          {
            title: "Decision Deposit",
            content: (
              <SummaryDecisionDepositValueWrapper>
                <ValueDisplay
                  value={toPrecision(decisionDeposit, decimals)}
                  symbol={symbol}
                />
              </SummaryDecisionDepositValueWrapper>
            ),
          },
        ]}
        chart={
          <SummaryThresholdCurveWrapper>
            <SummaryThresholdCurveItem>
              <SummaryThresholdCurveItemTitle>
                <span>Threshold Curves</span>
                <ArrowOutSimpleIcon onClick={showThresholdCurveDetail} />
              </SummaryThresholdCurveItemTitle>
              <SummaryThresholdCurveContent>
                <ThresholdCurvesChart
                  height={110}
                  scalesX={false}
                  scalesY={false}
                  layoutPadding={THRESHOLD_CURVE_PADDING}
                  labels={chartLabels}
                  supportData={supportData}
                  approvalData={approvalData}
                />

                <Divider />

                <SummaryThresholdCurveLegendWrapper>
                  <ThresholdCurvesGov2TrackSummaryLegend />
                </SummaryThresholdCurveLegendWrapper>
              </SummaryThresholdCurveContent>
            </SummaryThresholdCurveItem>
          </SummaryThresholdCurveWrapper>
        }
      />

      {showThresholdCurveDetailPopup && (
        <ThresholdCurvesPopup
          labels={chartLabels}
          supportData={supportData}
          approvalData={approvalData}
          setShow={setShowThresholdCurveDetailPopup}
        />
      )}
    </>
  );
}
