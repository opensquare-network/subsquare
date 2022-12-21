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
import BeenDelegated from "./beenDelegated";
import Summary from "next-common/components/summary/new";
import Content from "next-common/components/summary/cardContent";
import Column from "next-common/components/styled/column";
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
import useGov2ThresholdCurveData from "next-common/utils/hooks/useGov2ThresholdCurveData";
import FlexCenter from "next-common/components/styled/flexCenter";
import Grid from "next-common/components/styled/grid";

// used in `Divider` and `ThresholdCurvesChart`
const THRESHOLD_CURVE_PADDING = 8;

const SummaryContentWrapper = styled.div`
  display: flex;

  ${smcss(css`
    display: block;
  `)}
`;

const SummaryItemWrapper = styled.div`
  flex: 2;
  width: 100%;
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
  margin: 0 -4px;
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
    color: ${(p) => p.theme.textTertiary};
  }
`;

// fix divider position
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

  let footer = null;
  if (!noDelegation) {
    footer = (
      <Column gap={8}>
        <Delegation trackId={id} />
        <BeenDelegated trackId={id} />
      </Column>
    );
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
          <Grid gap={16} columns={2}>
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
                  <SummaryGreyText>
                    {" "}
                    {confirmPeriodBlockTime[1]}
                  </SummaryGreyText>
                </span>
              </Content>
            </SummaryItem>

            <SummaryItem>
              <SummaryItemTitle>Prepare Period</SummaryItemTitle>
              <Content>
                <span>
                  {preparePeriodBlockTime[0] || 0}
                  <SummaryGreyText>
                    {" "}
                    {preparePeriodBlockTime[1]}
                  </SummaryGreyText>
                </span>
              </Content>
            </SummaryItem>

            <SummaryItem>
              <SummaryItemTitle>Decision</SummaryItemTitle>
              <Content>
                <span>
                  {decisionPeriodBlockTime[0] || 0}
                  <SummaryGreyText>
                    {" "}
                    {decisionPeriodBlockTime[1]}
                  </SummaryGreyText>
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
            <SummaryItem style={{ minWidth: 146 }}>
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
          </Grid>
        </SummaryItemWrapper>

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
