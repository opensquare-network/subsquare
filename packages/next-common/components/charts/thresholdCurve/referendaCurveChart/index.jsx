import useReferendumCurveData from "next-common/utils/hooks/referenda/detail/useReferendumCurveData";
import {
  useApprovalThresholdDatasetConfig,
  useApprovalValueDatasetConfig,
  useAyesValueDatasetConfig,
  useNaysValueDatasetConfig,
  useSupportThresholdDatasetConfig,
  useSupportValueDatasetConfig,
} from "next-common/components/charts/thresholdCurve/utils/dataset";
import useHistoryTallyValueData from "next-common/components/charts/thresholdCurve/useHistoryTallyValueData";
import { Line } from "react-chartjs-2";
import hoverLinePlugin from "next-common/components/charts/plugins/hoverLine";
import useDetailPageOptions from "next-common/components/charts/thresholdCurve/utils/options";
import { set } from "lodash-es";
import useInnerPoints from "next-common/components/charts/thresholdCurve/hooks/useInnerPoints";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import { useRef, useState } from "react";
import CustomXTickLabels from "./curveChartCustomXTickLabels";
import ApprovalBubbleArea from "./approvalBubbleArea";
import CurveChartTooltip from "./curveChartTooltip";
import useChartOptionsWithTooltip from "./curveChartTooltip/useChartOptionsWithTooltip";
import { useOnchainData } from "next-common/context/post";
import useFetchReferendaTallyHistory from "next-common/utils/hooks/referenda/useFetchReferendaTallyHistory";

// used for detail page curve chart
export default function ReferendaCurveChart({ showAvatar, showAyeNay }) {
  const { referendumIndex } = useOnchainData();
  useFetchReferendaTallyHistory(referendumIndex);

  const { width } = useWindowSize();
  const chartRef = useRef();
  const chartWrapper = useRef();
  const { labels, supportData, approvalData } = useReferendumCurveData();
  const supportCurveConfig = useSupportThresholdDatasetConfig(supportData);
  const approvalCurveConfig = useApprovalThresholdDatasetConfig(approvalData);
  const [tooltip, setTooltip] = useState({
    visible: false,
    position: { x: 0, y: 0 },
    data: {},
  });

  const {
    historySupportData,
    historyApprovalData,
    historyAyesData,
    historyNaysData,
  } = useHistoryTallyValueData();

  const supportHistoryConfig = useSupportValueDatasetConfig(historySupportData);
  const approvalHistoryConfig =
    useApprovalValueDatasetConfig(historyApprovalData);
  const ayesHistoryConfig = useAyesValueDatasetConfig(historyAyesData);
  const naysHistoryConfig = useNaysValueDatasetConfig(historyNaysData);

  const datasets = [
    approvalCurveConfig,
    supportCurveConfig,
    approvalHistoryConfig,
    supportHistoryConfig,
    historyAyesData?.length && showAyeNay && ayesHistoryConfig,
    historyNaysData?.length && showAyeNay && naysHistoryConfig,
  ].filter(Boolean);

  const chartData = { labels, datasets };
  const defaultOptions = useDetailPageOptions(labels, datasets);
  const options = useChartOptionsWithTooltip(defaultOptions, setTooltip);

  const { approvalInnerPoint, supportInnerPoint } = useInnerPoints(labels);
  set(
    options,
    "plugins.annotation.annotations.pointSupportInner",
    supportInnerPoint,
  );
  set(
    options,
    "plugins.annotation.annotations.pointApprovalInner",
    approvalInnerPoint,
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
        <CurveChartTooltip container={chartWrapper.current} {...tooltip} />
        {chartRef.current && showAvatar && (
          <ApprovalBubbleArea
            showAyeNay={showAyeNay}
            scales={chartRef.current?.scales}
            chartArea={chartRef.current?.chartArea}
            historyApprovalData={historyApprovalData}
          />
        )}
      </div>
      <CustomXTickLabels
        showAyeNay={showAyeNay}
        chartArea={chartRef.current?.chartArea}
        labelsLength={labels.length}
      />
    </div>
  );
}
