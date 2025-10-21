import {
  useApprovalThresholdDatasetConfig,
  useSupportThresholdDatasetConfig,
} from "next-common/components/charts/thresholdCurve/utils/dataset";

export default function useFellowshipReferendaCurveChartData(
  labels,
  supportData,
  approvalData,
) {
  const supportThresholdConfig = useSupportThresholdDatasetConfig(supportData);
  const approvalThresholdConfig =
    useApprovalThresholdDatasetConfig(approvalData);

  return {
    chartData: {
      labels: labels,
      datasets: [approvalThresholdConfig, supportThresholdConfig],
    },
  };
}
