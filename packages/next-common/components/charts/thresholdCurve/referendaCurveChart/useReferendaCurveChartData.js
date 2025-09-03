import {
  useApprovalThresholdDatasetConfig,
  useApprovalValueDatasetConfig,
  useAyesValueDatasetConfig,
  useNaysValueDatasetConfig,
  useSupportThresholdDatasetConfig,
  useSupportValueDatasetConfig,
} from "next-common/components/charts/thresholdCurve/utils/dataset";
import useHistoryTallyValueData from "next-common/components/charts/thresholdCurve/useHistoryTallyValueData";
import { useMemo } from "react";

export default function useReferendaCurveChartData(
  showAyeNay,
  rangeData,
  labels,
  supportData,
  approvalData,
) {
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

  const datasets = useMemo(
    () =>
      [
        {
          ...approvalCurveConfig,
          data: approvalCurveConfig.data.slice(rangeData[0], rangeData[1]),
        },
        {
          ...supportCurveConfig,
          data: supportCurveConfig.data.slice(rangeData[0], rangeData[1]),
        },
        {
          ...approvalHistoryConfig,
          data: approvalHistoryConfig.data.slice(rangeData[0], rangeData[1]),
        },
        {
          ...supportHistoryConfig,
          data: supportHistoryConfig.data.slice(rangeData[0], rangeData[1]),
        },
        historyAyesData?.length &&
          showAyeNay && {
            ...ayesHistoryConfig,
            data: ayesHistoryConfig.data.slice(rangeData[0], rangeData[1]),
          },
        historyNaysData?.length &&
          showAyeNay && {
            ...naysHistoryConfig,
            data: naysHistoryConfig.data.slice(rangeData[0], rangeData[1]),
          },
      ].filter(Boolean),
    [
      approvalCurveConfig,
      approvalHistoryConfig,
      ayesHistoryConfig,
      historyAyesData?.length,
      historyNaysData?.length,
      naysHistoryConfig,
      rangeData,
      showAyeNay,
      supportCurveConfig,
      supportHistoryConfig,
    ],
  );

  const chartData = { labels, datasets };

  return {
    labels,
    chartData,
    historyApprovalData,
  };
}
