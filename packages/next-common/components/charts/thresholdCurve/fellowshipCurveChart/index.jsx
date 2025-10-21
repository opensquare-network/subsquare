import React, { useRef } from "react";
import useFellowshipReferendaCurveChartData from "./useFellowshipReferendaCurveChartData";
import { Line } from "react-chartjs-2";
import hoverLinePlugin from "next-common/components/charts/plugins/hoverLine";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import { useReferendumVotingFinishIndexer } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";
import useFellowshipCurveChartOptions from "./useFellowshipCurveChartOptions";
import useFellowshipReferendaCurveData from "./useFellowshipReferendaCurveData";

export default function FellowshipCurveChart() {
  const indexer = useReferendumVotingFinishIndexer();

  return (
    <MigrationConditionalApiProvider indexer={indexer}>
      <FellowshipCurveChartWithContext />
    </MigrationConditionalApiProvider>
  );
}

import useSlider from "../referendaCurveChart/useSlider";
function FellowshipCurveChartWithContext() {
  const chartRef = useRef();
  const { width } = useWindowSize();
  const { labels, supportData, approvalData, totalHours } =
    useFellowshipReferendaCurveData();
  const { rangeData, component: slider } = useSlider(
    chartRef.current?.chartArea,
    false,
    totalHours,
  );
  const rangeLabel = labels.slice(rangeData[0], rangeData[1]);

  const { chartData } = useFellowshipReferendaCurveChartData(
    rangeLabel,
    supportData,
    approvalData,
  );

  const options = useFellowshipCurveChartOptions(
    rangeLabel,
    supportData,
    approvalData,
  );

  return (
    <div style={{ height: width > 768 ? 320 : 144 }}>
      <Line
        ref={chartRef}
        data={chartData}
        options={options}
        plugins={[hoverLinePlugin]}
      />
      {slider}
    </div>
  );
}
