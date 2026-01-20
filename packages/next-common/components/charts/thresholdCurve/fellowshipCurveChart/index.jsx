import React, { useRef, useMemo } from "react";
import useFellowshipReferendaCurveChartData, {
  useFellowshipReferendaCurveChartDataWithHistory,
} from "./useFellowshipReferendaCurveChartData";
import { Line } from "react-chartjs-2";
import hoverLinePlugin from "next-common/components/charts/plugins/hoverLine";
import { useWindowWidthContext } from "next-common/context/windowSize";
import { useReferendumVotingFinishIndexer } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";
import useFellowshipCurveChartOptions, {
  useFellowshipCurveChartOptionsWithThresholdLine,
} from "./useFellowshipCurveChartOptions";
import { useOnchainData } from "next-common/context/post";
import useFetchFellowshipReferendaTallyHistory from "next-common/utils/hooks/fellowship/useFetchFellowshipReferendaTallyHistory";
import { isCollectivesChain } from "next-common/utils/chain";
import { useChain } from "next-common/context/chain";
import useSlider from "../referendaCurveChart/useSlider";
import FellowshipApprovalBubbleArea from "./approvalBubbleArea";

export default function FellowshipCurveChart({ showVoter }) {
  const indexer = useReferendumVotingFinishIndexer();
  const chain = useChain();

  const isCollectives = isCollectivesChain(chain);

  return (
    <MigrationConditionalApiProvider indexer={indexer}>
      {isCollectives ? (
        <CollectivesFellowshipCurveChartWithContext showVoter={showVoter} />
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

function CollectivesFellowshipCurveChartWithContext({ showVoter = true }) {
  const { referendumIndex } = useOnchainData();
  useFetchFellowshipReferendaTallyHistory(referendumIndex);

  const width = useWindowWidthContext();
  const chartRef = useRef();
  const chartWrapper = useRef();

  const {
    labels,
    datasets,
    supportData,
    approvalData,
    historyApprovalData,
    totalHours,
  } = useFellowshipReferendaCurveChartDataWithHistory();

  const {
    rangeData,
    ranging,
    component: slider,
  } = useSlider(chartRef.current?.chartArea, false, totalHours || 0);

  const rangeLabel = labels.slice(rangeData[0], rangeData[1]);

  const rangeDatasets = useMemo(() => {
    return datasets.map((dataset) => ({
      ...dataset,
      data: dataset.data?.slice(rangeData[0], rangeData[1]),
    }));
  }, [datasets, rangeData]);

  const options = useFellowshipCurveChartOptions(
    rangeLabel,
    supportData,
    approvalData,
  );

  const chartData = useMemo(
    () => ({ labels: rangeLabel, datasets: rangeDatasets }),
    [rangeLabel, rangeDatasets],
  );

  return (
    <div>
      <div
        ref={chartWrapper}
        style={{ height: width <= 768 ? 144 : 320 }}
        className="relative"
      >
        <Line
          ref={chartRef}
          data={chartData}
          options={options}
          plugins={[hoverLinePlugin]}
        />
        <FellowshipApprovalBubbleArea
          rangeData={rangeData}
          visible={showVoter && !ranging}
          chartArea={chartRef.current?.chartArea}
          historyApprovalData={historyApprovalData}
        />
      </div>
      {slider}
    </div>
  );
}
