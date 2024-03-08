import { range } from "lodash-es";
import { useSelector } from "react-redux";
import {
  getTrackApprovalCurve,
  getTrackSupportCurve,
} from "../../context/post/gov2/curve";
import { blockTimeSelector } from "../../store/reducers/chainSlice";

export default function useGov2ThresholdCurveData(track) {
  const { decisionPeriod } = track ?? {};
  const blockTime = useSelector(blockTimeSelector);

  const oneHour = 3600 * 1000;
  const blockStep = oneHour / blockTime; // it means the blocks between 2 dots.
  const hours = decisionPeriod / blockStep;
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
