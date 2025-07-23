import { useTrack } from "next-common/context/post/gov2/track";
import { range } from "lodash-es";
import {
  getTrackApprovalCurve,
  getTrackSupportCurve,
} from "next-common/context/post/gov2/curve";
import { useBlockSteps, useDecisionBlocks } from "./useReferendumBlocks";

// used for curve chart on OpenGov referendum detail page.
export default function useReferendumCurveData() {
  const track = useTrack();
  const blockStep = useBlockSteps();
  const decisionBlocks = useDecisionBlocks();
  const hours = decisionBlocks / blockStep;
  const labels = range(hours + 1);

  const supportCalculator = getTrackSupportCurve(track);
  const supportData = labels.map((i) =>
    supportCalculator ? supportCalculator(i / hours) * 100 : 0,
  );

  const approvalCalculator = getTrackApprovalCurve(track);
  const approvalData = labels.map((i) =>
    approvalCalculator ? approvalCalculator(i / hours) * 100 : 0,
  );

  return {
    labels,
    supportData,
    approvalData,
  };
}
