import {
  useApprovalThresholdDatasetConfig,
  useSupportThresholdDatasetConfig,
} from "next-common/components/charts/thresholdCurve/utils/dataset";

export default function useFellowshipReferendaCurveChartData(
  labels,
  supportData,
  approvalData,
  rangeData,
) {
  const supportThresholdConfig = useSupportThresholdDatasetConfig(supportData);
  const approvalThresholdConfig =
    useApprovalThresholdDatasetConfig(approvalData);

  return {
    chartData: {
      labels: labels,
      datasets: [
        {
          ...approvalThresholdConfig,
          data: approvalThresholdConfig.data.slice(rangeData[0], rangeData[1]),
        },
        {
          ...supportThresholdConfig,
          data: supportThresholdConfig.data.slice(rangeData[0], rangeData[1]),
        },
      ],
    },
  };
}
