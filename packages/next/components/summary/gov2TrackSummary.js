import styled, { css } from "styled-components";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { estimateBlocksTime, toPrecision } from "next-common/utils";
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
import _range from "lodash.range";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { smcss } from "next-common/utils/responsive";
import DividerOrigin from "next-common/components/styled/layout/divider";
import {
  getTrackApprovalCurve,
  getTrackSupportCurve,
} from "next-common/context/post/gov2/curve";

// used in `Divider` and `ThresholdCurvesChart`
const THRESHOLD_CURVE_PADDING = 8;

const SummaryContentWrapper = styled.div`
  display: flex;

  ${smcss(css`
    display: block;
  `)}
`;

const SummaryItemWrapper = styled(SummaryItemWrapperOrigin)`
  flex: 2;
  flex-wrap: wrap;

  ${SummaryItem} {
    width: calc(50% - 16px);
    flex: unset;
  }

  ${smcss(css`
    flex-direction: row;
  `)}
`;
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
const SummaryThresholdCurveLegendWrapper = styled.div`
  margin-top: 8px;
`;
const SummaryThresholdCurveItemTitle = styled(SummaryItemTitle)`
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${ArrowOutSimpleIcon} {
    cursor: pointer;
  }
`;
const SummaryDecisionDepositValueWrapper = styled.span`
  .value-display-symbol {
    color: ${(p) => p.theme.textTertiary};
  }
`;

const Divider = styled(DividerOrigin)`
  margin-top: ${0 - THRESHOLD_CURVE_PADDING}px;
  margin-right: ${THRESHOLD_CURVE_PADDING}px;
  ${smcss(`
    margin-right: ${4 + THRESHOLD_CURVE_PADDING}px;
  `)}
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
    decisionDeposit,
  } = period ?? {};

  const { decimals, symbol } = useChainSettings();

  const [showThresholdCurveDetailPopup, setShowThresholdCurveDetailPopup] =
    useState(false);

  const blockTime = useSelector(blockTimeSelector);
  const preparePeriodBlockTime = estimateBlocksTime(preparePeriod, blockTime);
  const decisionPeriodBlockTime = estimateBlocksTime(decisionPeriod, blockTime);
  const confirmPeriodBlockTime = estimateBlocksTime(confirmPeriod, blockTime);

  const decisionPeriodHrs = Number(decisionPeriodBlockTime[0]) * 24;
  const chartLabels = _range(decisionPeriodHrs + 1);

  const supportCalculator = getTrackSupportCurve(period);
  const supportData = chartLabels.map((i) =>
    supportCalculator ? supportCalculator(i / decisionPeriodHrs) * 100 : 0
  );

  const approvalCalculator = getTrackApprovalCurve(period);
  const approvalData = chartLabels.map((i) =>
    approvalCalculator ? approvalCalculator(i / decisionPeriodHrs) * 100 : 0
  );

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

          {/* prevent title text wrap */}
          <SummaryItem style={{ minWidth: 144 }}>
            <SummaryItemTitle>Decision Deposit</SummaryItemTitle>
            <Content>
              <SummaryDecisionDepositValueWrapper>
                <ValueDisplay
                  value={toPrecision(decisionDeposit, decimals)}
                  symbol={symbol}
                />
              </SummaryDecisionDepositValueWrapper>
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
                height={104}
                scalesX={false}
                scalesY={false}
                layoutPadding={THRESHOLD_CURVE_PADDING}
                labels={chartLabels}
                supportData={supportData}
                approvalData={approvalData}
              />

              <Divider />

              <SummaryThresholdCurveLegendWrapper>
                <ThresholdCurvesLegend />
              </SummaryThresholdCurveLegendWrapper>
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
