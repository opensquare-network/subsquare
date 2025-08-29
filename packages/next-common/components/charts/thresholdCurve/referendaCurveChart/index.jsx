import useReferendumCurveData from "next-common/utils/hooks/referenda/detail/useReferendumCurveData";
import { Line } from "react-chartjs-2";
import hoverLinePlugin from "next-common/components/charts/plugins/hoverLine";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import { useRef, useState, useMemo } from "react";
import CustomXTickLabels from "./curveChartCustomXTickLabels";
import ApprovalBubbleArea from "./approvalBubbleArea";
import CurveChartTooltip from "./curveChartTooltip";
import useChartTooltipPlugin from "./curveChartTooltip/useChartTooltipPlugin";
import { useOnchainData } from "next-common/context/post";
import useFetchReferendaTallyHistory from "next-common/utils/hooks/referenda/useFetchReferendaTallyHistory";
import ThresholdCurvesGov2TallyLegend from "../legend/gov2TallyLegend";
import Slider from "next-common/components/slider";
import useCurveChartOptions from "./useCurveChartOptions";
import useReferendaCurveChartData from "./useReferendaCurveChartData";

export default function ReferendaCurveChart({ showVoter, showAyeNay }) {
  const { referendumIndex } = useOnchainData();
  useFetchReferendaTallyHistory(referendumIndex);
  const [tooltip, setTooltip] = useState({
    visible: false,
    position: { x: 0, y: 0 },
    data: {},
  });

  const { width } = useWindowSize();
  const chartRef = useRef();
  const chartWrapper = useRef();
  const { labels, supportData, approvalData } = useReferendumCurveData();
  const [rangeData, setRangeData] = useState([0, labels.length]);
  const rangeLabel = labels.slice(rangeData[0], rangeData[1]);

  const { chartData, historyApprovalData } = useReferendaCurveChartData(
    showAyeNay,
    [rangeData[0], rangeData[1] + 1],
    rangeLabel,
    supportData,
    approvalData,
  );

  const defaultOptions = useCurveChartOptions(
    rangeLabel,
    labels,
    chartData.datasets,
    [rangeData[0], rangeData[1] + 1],
  );
  const options = useChartTooltipPlugin(defaultOptions, setTooltip);

  const style = useMemo(() => {
    const { left = 0, right = 0 } = chartRef.current?.chartArea || {};
    return {
      paddingLeft: `${left}px`,
      paddingRight: showAyeNay ? `calc(100% - ${right}px)` : "0px",
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartRef.current?.chartArea, showAyeNay]);

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
          <CurveChartTooltip
            rangeData={rangeData}
            container={chartWrapper.current}
            {...tooltip}
          />
          {chartRef.current && (
            <ApprovalBubbleArea
              rangeData={rangeData}
              visible={showVoter}
              showAyeNay={showAyeNay}
              chartArea={chartRef.current?.chartArea}
              historyApprovalData={historyApprovalData}
            />
          )}
        </div>
        <CustomXTickLabels
          rangeData={rangeData}
          showAyeNay={showAyeNay}
          chartArea={chartRef.current?.chartArea}
        />
        <div className="pt-2" style={style}>
          <Slider
            defaultValue={rangeData}
            min={0}
            max={labels.length}
            minDistance={50}
            onChange={setRangeData}
            formatValue={() => null}
          />
        </div>
      </div>
      <ThresholdCurvesGov2TallyLegend showAyeNay={showAyeNay} />
    </>
  );
}
