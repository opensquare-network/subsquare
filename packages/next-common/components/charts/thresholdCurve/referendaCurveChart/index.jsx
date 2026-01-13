import useReferendumCurveData from "next-common/utils/hooks/referenda/detail/useReferendumCurveData";
import { Line } from "react-chartjs-2";
import hoverLinePlugin from "next-common/components/charts/plugins/hoverLine";
import { useWindowWidthContext } from "next-common/context/windowSize";
import { useRef } from "react";
import CustomXTickLabels from "./curveChartCustomXTickLabels";
import ApprovalBubbleArea from "./approvalBubbleArea";
import { useChartTooltipPlugin } from "./curveChartTooltip";
import { useOnchainData } from "next-common/context/post";
import useFetchReferendaTallyHistory from "next-common/utils/hooks/referenda/useFetchReferendaTallyHistory";
import ThresholdCurvesGov2TallyLegend from "../legend/gov2TallyLegend";
import useCurveChartOptions from "./useCurveChartOptions";
import useReferendaCurveChartData from "./useReferendaCurveChartData";
import useSlider from "./useSlider";

export default function ReferendaCurveChart({ showVoter, showAyeNay }) {
  const { referendumIndex } = useOnchainData();
  useFetchReferendaTallyHistory(referendumIndex);

  const width = useWindowWidthContext();
  const chartRef = useRef();
  const chartWrapper = useRef();
  const { labels, supportData, approvalData, totalHours } =
    useReferendumCurveData();

  const {
    rangeData,
    ranging,
    component: slider,
  } = useSlider(chartRef.current?.chartArea, showAyeNay, totalHours);

  const rangeLabel = labels.slice(rangeData[0], rangeData[1]);

  const { chartData, historyApprovalData } = useReferendaCurveChartData(
    showAyeNay,
    [rangeData[0], rangeData[1] + 1],
    rangeLabel,
    supportData,
    approvalData,
    totalHours,
  );

  const defaultOptions = useCurveChartOptions(rangeLabel, chartData.datasets, [
    rangeData[0],
    rangeData[1] + 1,
  ]);

  const { options, component: tooltip } = useChartTooltipPlugin(
    defaultOptions,
    rangeData,
  );

  return (
    <>
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
          <ApprovalBubbleArea
            rangeData={rangeData}
            visible={showVoter && !ranging}
            showAyeNay={showAyeNay}
            chartArea={chartRef.current?.chartArea}
            historyApprovalData={historyApprovalData}
          />
          {tooltip}
        </div>
        <CustomXTickLabels
          rangeData={rangeData}
          showAyeNay={showAyeNay}
          chartArea={chartRef.current?.chartArea}
        />
        {slider}
      </div>
      <ThresholdCurvesGov2TallyLegend showAyeNay={showAyeNay} />
    </>
  );
}
