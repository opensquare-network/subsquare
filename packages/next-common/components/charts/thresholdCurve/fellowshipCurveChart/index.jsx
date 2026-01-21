import useFellowshipReferendaCurveChartData from "./useFellowshipReferendaCurveChartData";
import { Line } from "react-chartjs-2";
import hoverLinePlugin from "next-common/components/charts/plugins/hoverLine";
import { useWindowWidthContext } from "next-common/context/windowSize";
import { useReferendumVotingFinishIndexer } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";
import { useFellowshipCurveChartOptionsWithThresholdLine } from "./useFellowshipCurveChartOptions";
import { isCollectivesChain } from "next-common/utils/chain";
import { useChain } from "next-common/context/chain";
import { CollectivesFellowshipCurveChartWithContextWrapper } from "./collectivesFellowshipCurveChartWithContext";

export default function FellowshipCurveChart() {
  const indexer = useReferendumVotingFinishIndexer();
  const chain = useChain();

  const isCollectives = isCollectivesChain(chain);

  return (
    <MigrationConditionalApiProvider indexer={indexer}>
      {isCollectives ? (
        <CollectivesFellowshipCurveChartWithContextWrapper />
      ) : (
        <FellowshipCurveChartWithContext />
      )}
    </MigrationConditionalApiProvider>
  );
}

function FellowshipCurveChartWithContext() {
  const width = useWindowWidthContext();
  const { labels, datasets, supportData, approvalData } =
    useFellowshipReferendaCurveChartData();
  const options = useFellowshipCurveChartOptionsWithThresholdLine(
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
