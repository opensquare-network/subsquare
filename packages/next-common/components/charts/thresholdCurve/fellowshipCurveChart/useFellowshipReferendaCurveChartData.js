import { useTrack } from "next-common/context/post/gov2/track";
import { range } from "lodash-es";
import {
  getTrackApprovalCurve,
  getTrackSupportCurve,
} from "next-common/context/post/gov2/curve";
import {
  useDecisionHours,
  usePreparingHours,
} from "next-common/utils/hooks/referenda/detail/useReferendumBlocks";
import {
  useApprovalThresholdDatasetConfig,
  useSupportThresholdDatasetConfig,
  useApprovalValueDatasetConfig,
  useSupportValueDatasetConfig,
} from "next-common/components/charts/thresholdCurve/utils/dataset";
import { useFellowshipHistoryTallyValueData } from "next-common/components/charts/thresholdCurve/useFellowshipHistoryTallyValueData";
import { useMemo } from "react";

function useFellowshipReferendaCurveData() {
  const track = useTrack();
  const decisionHours = useDecisionHours();
  const preparingHours = usePreparingHours();
  const hours = decisionHours + preparingHours;
  const labels = range(hours + 1);

  const supportCalculator = getTrackSupportCurve(track);
  const approvalCalculator = getTrackApprovalCurve(track);
  let supportData = [];
  let approvalData = [];

  for (let index = 0; index < labels.length; index++) {
    if (index < preparingHours) {
      supportData.push(null);
      approvalData.push(null);
    } else {
      const decisionIndex = index - preparingHours;

      supportData.push(
        supportCalculator
          ? supportCalculator(decisionIndex / decisionHours) * 100
          : 0,
      );
      approvalData.push(
        approvalCalculator
          ? approvalCalculator(decisionIndex / decisionHours) * 100
          : 0,
      );
    }
  }

  return {
    labels,
    supportData,
    approvalData,
    totalHours: hours,
  };
}

export function useFellowshipReferendaCurveChartDataWithHistory() {
  const { labels, supportData, approvalData, totalHours } =
    useFellowshipReferendaCurveData();
  const supportThresholdConfig = useSupportThresholdDatasetConfig(supportData);
  const approvalThresholdConfig =
    useApprovalThresholdDatasetConfig(approvalData);

  const { historySupportData, historyApprovalData } =
    useFellowshipHistoryTallyValueData(totalHours);

  const supportHistoryConfig = useSupportValueDatasetConfig(historySupportData);
  const approvalHistoryConfig =
    useApprovalValueDatasetConfig(historyApprovalData);

  const datasets = useMemo(
    () =>
      [
        approvalThresholdConfig,
        supportThresholdConfig,
        historyApprovalData?.length && approvalHistoryConfig,
        historySupportData?.length && supportHistoryConfig,
      ].filter(Boolean),
    [
      approvalThresholdConfig,
      supportThresholdConfig,
      approvalHistoryConfig,
      supportHistoryConfig,
      historyApprovalData?.length,
      historySupportData?.length,
    ],
  );

  return {
    labels,
    supportData,
    approvalData,
    datasets,
    historyApprovalData,
    totalHours,
  };
}

export default function useFellowshipReferendaCurveChartData() {
  const { labels, supportData, approvalData } =
    useFellowshipReferendaCurveData();
  const supportThresholdConfig = useSupportThresholdDatasetConfig(supportData);
  const approvalThresholdConfig =
    useApprovalThresholdDatasetConfig(approvalData);

  return {
    labels,
    supportData,
    approvalData,
    datasets: [approvalThresholdConfig, supportThresholdConfig],
  };
}
