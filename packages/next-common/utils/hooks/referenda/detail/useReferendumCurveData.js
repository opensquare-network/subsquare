import { useTrack } from "next-common/context/post/gov2/track";
import { range } from "lodash-es";
import {
  getTrackApprovalCurve,
  getTrackSupportCurve,
} from "next-common/context/post/gov2/curve";
import {
  useBlockSteps,
  useDecisionBlocks,
  usePreparingBlocks,
} from "./useReferendumBlocks";

// used for curve chart on OpenGov referendum detail page.
export default function useReferendumCurveData() {
  const track = useTrack();
  const blockStep = useBlockSteps();
  const decisionBlocks = useDecisionBlocks();
  const preparingBlocks = usePreparingBlocks();
  const preparingHours = Math.floor(preparingBlocks / blockStep);
  const decisionHours = decisionBlocks / blockStep;
  const hours = decisionHours + preparingHours;
  const labels = range(hours);

  const supportCalculator = getTrackSupportCurve(track);
  const approvalCalculator = getTrackApprovalCurve(track);
  let supportData = [];
  let approvalData = [];

  for (let index = 0; index < labels.length; index++) {
    if (index < preparingHours) {
      supportData.push(null);
      approvalData.push(null);
    } else {
      const i = index - preparingHours;
      supportData.push(
        supportCalculator ? supportCalculator(i / hours) * 100 : 0,
      );
      approvalData.push(
        approvalCalculator ? approvalCalculator(i / hours) * 100 : 0,
      );
    }
  }

  return {
    labels,
    supportData,
    approvalData,
  };
}
