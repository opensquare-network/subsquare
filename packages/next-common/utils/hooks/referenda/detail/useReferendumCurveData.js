import { useTrack } from "next-common/context/post/gov2/track";
import { useDecidingSince } from "next-common/context/post/gov2/referendum";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { range } from "lodash-es";
import {
  getTrackApprovalCurve,
  getTrackSupportCurve,
} from "next-common/context/post/gov2/curve";

// used for curve chart on OpenGov referendum detail page.
export default function useReferendumCurveData() {
  const track = useTrack();
  const decidingSince = useDecidingSince();
  const finishedHeight = useReferendumVotingFinishHeight();
  const blockTime = useSelector(blockTimeSelector);

  let decisionBlocks = track.decisionPeriod;
  if (finishedHeight && finishedHeight > decidingSince + track.decisionPeriod) {
    decisionBlocks = finishedHeight - decidingSince;
  }

  const oneHour = 3600 * 1000;
  const blockStep = oneHour / blockTime; // it means the blocks between 2 dots.
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
