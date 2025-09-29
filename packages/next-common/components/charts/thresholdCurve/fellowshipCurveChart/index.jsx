import React from "react";
import useFellowshipReferendaCurveChartData from "./useFellowshipReferendaCurveChartData";
import { Line } from "react-chartjs-2";
import hoverLinePlugin from "next-common/components/charts/plugins/hoverLine";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import { useReferendumVotingFinishIndexer } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";
import useFellowshipCurveChartOptions from "./useFellowshipCurveChartOptions";

export default function FellowshipCurveChart() {
  const indexer = useReferendumVotingFinishIndexer();

  return (
    <MigrationConditionalApiProvider indexer={indexer}>
      <FellowshipCurveChartWithContext />
    </MigrationConditionalApiProvider>
  );
}

function FellowshipCurveChartWithContext() {
  const { width } = useWindowSize();
  const { labels, datasets, supportData, approvalData } =
    useFellowshipReferendaCurveChartData();
  const options = useFellowshipCurveChartOptions(
    labels,
    supportData,
    approvalData,
  );

  const chartData = { labels, datasets };

  return (
    <div style={{ height: width > 768 ? 320 : 144 }}>
      <Line data={chartData} options={options} plugins={[hoverLinePlugin]} />
    </div>
  );
}
