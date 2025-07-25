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
import { useRef } from "react";
import { useDecisionIndex } from "next-common/utils/hooks/referenda/detail/useReferendumBlocks";
import CustomXTickLabels from "./referendaCurveChartCustomXTickLabels";

// used for detail page curve chart
export default function ReferendaCurveChart({ showAyeNay }) {
  const { width } = useWindowSize();
  const chartRef = useRef();
  const { labels, supportData, approvalData } = useReferendumCurveData();
  const decisionIndex = useDecisionIndex();
  const supportCurveConfig = useSupportThresholdDatasetConfig(supportData);
  const approvalCurveConfig = useApprovalThresholdDatasetConfig(approvalData);

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
  const options = useDetailPageOptions(labels, datasets);

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
      <div style={{ height: width <= 768 ? 144 : 320 }}>
        <Line
          ref={chartRef}
          data={chartData}
          options={options}
          plugins={[hoverLinePlugin]}
        />
      </div>
      <CustomXTickLabels
        showAyeNay={showAyeNay}
        chartArea={chartRef.current?.chartArea}
        decisionIndex={decisionIndex}
        labelsLength={labels.length}
      />
    </div>
  );
}
