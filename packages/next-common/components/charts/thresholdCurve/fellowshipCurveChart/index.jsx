import React, { useRef } from "react";
import useFellowshipReferendaCurveChartData from "./useFellowshipReferendaCurveChartData";
import { Line } from "react-chartjs-2";
import hoverLinePlugin from "next-common/components/charts/plugins/hoverLine";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import { useReferendumVotingFinishIndexer } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";
import useFellowshipCurveChartOptions from "./useFellowshipCurveChartOptions";
import useFellowshipReferendaCurveData from "./useFellowshipReferendaCurveData";
import useSlider from "../referendaCurveChart/useSlider";
import CustomXTickLabels from "./curveChartCustomXTickLabels";
import ThresholdCurvesGov2TallyLegend from "next-common/components/charts/thresholdCurve/legend/gov2TallyLegend";

export default function FellowshipCurveChart() {
  const indexer = useReferendumVotingFinishIndexer();

  return (
    <MigrationConditionalApiProvider indexer={indexer}>
      <FellowshipCurveChartWithContext />
    </MigrationConditionalApiProvider>
  );
}

function FellowshipCurveChartWithContext() {
  const chartRef = useRef();
  const { width } = useWindowSize();
  const { labels, supportData, approvalData, totalHours } =
    useFellowshipReferendaCurveData();
  const { rangeData } = useSlider(
    chartRef.current?.chartArea,
    false,
    totalHours,
  );
  const rangeLabel = labels.slice(rangeData[0], rangeData[1]);

  const { chartData } = useFellowshipReferendaCurveChartData(
    rangeLabel,
    supportData,
    approvalData,
    rangeData,
  );

  const options = useFellowshipCurveChartOptions(
    rangeLabel,
    supportData,
    approvalData,
    rangeData,
  );

  return (
    <>
      <div>
        <div style={{ height: width > 768 ? 320 : 144 }}>
          <Line
            ref={chartRef}
            data={chartData}
            options={options}
            plugins={[hoverLinePlugin]}
          />
        </div>
        <CustomXTickLabels
          rangeData={rangeData}
          showAyeNay={false}
          chartArea={chartRef.current?.chartArea}
        />
        {/* {slider} */}
      </div>
      <ThresholdCurvesGov2TallyLegend showAyeNay={false} />
    </>
  );
}
