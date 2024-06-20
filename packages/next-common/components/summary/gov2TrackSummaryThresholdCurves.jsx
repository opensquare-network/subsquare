import styled from "styled-components";
import { useState } from "react";
import ThresholdCurvesChart from "next-common/components/charts/thresholdCurve";
import { ArrowExpend } from "@osn/icons/subsquare";
import ThresholdCurvesGov2TrackSummaryLegend from "next-common/components/charts/thresholdCurve/legend/gov2TrackSummaryLegend";
import { SummaryItemTitle } from "next-common/components/summary/styled";
import useGov2ThresholdCurveData from "next-common/utils/hooks/useGov2ThresholdCurveData";
import dynamicPopup from "next-common/lib/dynamic/popup";

const ThresholdCurvesPopup = dynamicPopup(() =>
  import("next-common/components/charts/thresholdCurve/popup"),
);

const SummaryThresholdCurveItem = styled.div`
  height: 100%;
`;

const SummaryThresholdCurveItemTitle = styled(SummaryItemTitle)`
  display: flex;
  justify-content: space-between;
`;

export default function Gov2TrackSummaryThresholdCurves({ period }) {
  const [showThresholdCurveDetailPopup, setShowThresholdCurveDetailPopup] =
    useState(false);

  const {
    labels: chartLabels,
    supportData,
    approvalData,
  } = useGov2ThresholdCurveData(period);

  function showThresholdCurveDetail() {
    setShowThresholdCurveDetailPopup(true);
  }

  return (
    <>
      <SummaryThresholdCurveItem className="md:w-1/4">
        <SummaryThresholdCurveItemTitle>
          <span>Threshold Curves</span>
          <ArrowExpend
            role="button"
            className="w-4 h-4 [&_path]:fill-textSecondary"
            onClick={showThresholdCurveDetail}
          />
        </SummaryThresholdCurveItemTitle>

        <div className="flex items-center justify-between -ml-1.5">
          <div className="w-[calc(100%-82px)] h-full">
            <ThresholdCurvesChart
              height={80}
              scalesX={false}
              scalesY={false}
              labels={chartLabels}
              layoutPadding={5}
              supportData={supportData}
              approvalData={approvalData}
            />
          </div>

          <ThresholdCurvesGov2TrackSummaryLegend className="flex-col gap-y-2 space-x-0" />
        </div>
      </SummaryThresholdCurveItem>

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
