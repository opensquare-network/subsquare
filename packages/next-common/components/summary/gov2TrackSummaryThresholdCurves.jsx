import styled from "styled-components";
import { useState } from "react";
import ThresholdCurvesChart from "next-common/components/charts/thresholdCurve";
import { ArrowExpend } from "@osn/icons/subsquare";
import ThresholdCurvesGov2TrackSummaryLegend from "next-common/components/charts/thresholdCurve/legend/gov2TrackSummaryLegend";
import ThresholdCurvesPopup from "next-common/components/charts/thresholdCurve/popup";
import { SummaryItemTitle } from "next-common/components/summary/styled";
import useGov2ThresholdCurveData from "next-common/utils/hooks/useGov2ThresholdCurveData";

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

        <div>
          <div className="mt-0.5">
            {/* different height */}
            <div className="max-md:block hidden">
              <ThresholdCurvesChart
                height={56}
                scalesX={false}
                scalesY={false}
                labels={chartLabels}
                supportData={supportData}
                approvalData={approvalData}
              />
            </div>
            <div className="block max-md:hidden">
              <ThresholdCurvesChart
                height={56}
                scalesX={false}
                scalesY={false}
                labels={chartLabels}
                supportData={supportData}
                approvalData={approvalData}
              />
            </div>
          </div>

          <div className="flex justify-center mt-0.5">
            <ThresholdCurvesGov2TrackSummaryLegend />
          </div>
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
