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
} from "next-common/components/charts/thresholdCurve/utils/dataset";

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
