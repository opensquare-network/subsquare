import _range from "lodash.range";
import { useSelector } from "react-redux";
import {
  getTrackApprovalCurve,
  getTrackSupportCurve,
} from "../../context/post/gov2/curve";
import { blockTimeSelector } from "../../store/reducers/chainSlice";
import { estimateBlocksTime } from "../index";

export default function useGov2ThresholdCurveData(track) {
  const { decisionPeriod } = track ?? {};

  const blockTime = useSelector(blockTimeSelector);
  const decisionPeriodBlockTime = estimateBlocksTime(decisionPeriod, blockTime);

  const decisionPeriodHrs = Number(decisionPeriodBlockTime[0]) * 24;
  const labels = _range(decisionPeriodHrs + 1);

  const supportCalculator = getTrackSupportCurve(track);
  const supportData = labels.map((i) =>
    supportCalculator ? supportCalculator(i / decisionPeriodHrs) * 100 : 0,
  );

  const approvalCalculator = getTrackApprovalCurve(track);
  const approvalData = labels.map((i) =>
    approvalCalculator ? approvalCalculator(i / decisionPeriodHrs) * 100 : 0,
  );

  return {
    labels,
    supportData,
    approvalData,
  };
}
