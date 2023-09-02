import useReferendumCurveData from "next-common/utils/hooks/referenda/detail/useReferendumCurveData";
import {
  useApprovalThresholdDatasetConfig,
  useApprovalValueDatasetConfig,
  useSupportThresholdDatasetConfig,
  useSupportValueDatasetConfig,
} from "next-common/components/charts/thresholdCurve/utils/dataset";
import useHistoryTallyValueData from "next-common/components/charts/thresholdCurve/useHistoryTallyValueData";
import { Line } from "react-chartjs-2";
import hoverLinePlugin from "next-common/components/charts/plugins/hoverLine";
import React from "react";
import useDetailPageOptions from "next-common/components/charts/thresholdCurve/utils/options";
import set from "lodash.set";
import useInnerPoints from "next-common/components/charts/thresholdCurve/hooks/useInnerPoints";
import useWindowSize from "next-common/utils/hooks/useWindowSize";

// used for detail page curve chart
export default function ReferendaCurveChart() {
  const { width } = useWindowSize();
  const { labels, supportData, approvalData } = useReferendumCurveData();
  const supportThresholdConfig = useSupportThresholdDatasetConfig(supportData);
  const approvalThresholdConfig =
    useApprovalThresholdDatasetConfig(approvalData);

  const { currentSupportData, currentApprovalData } =
    useHistoryTallyValueData();
  const supportValueConfig = useSupportValueDatasetConfig(currentSupportData);
  const approvalValueConfig =
    useApprovalValueDatasetConfig(currentApprovalData);

  const datasets = [
    approvalThresholdConfig,
    supportThresholdConfig,
    approvalValueConfig,
    supportValueConfig,
  ];

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
    <div style={{ height: width <= 768 ? 144 : 320 }}>
      <Line data={chartData} options={options} plugins={[hoverLinePlugin]} />
    </div>
  );
}
