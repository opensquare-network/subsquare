import {
  useApprovalThreshold,
  useSupportThreshold,
} from "next-common/context/post/gov2/threshold";
import BigNumber from "bignumber.js";
import {
  useApprovalPoints,
  useSupportPoints,
} from "next-common/components/charts/thresholdCurve/annotations";
import { useDecidingSince } from "next-common/context/post/gov2/referendum";
import { useDecidingEndHeight } from "next-common/context/post/gov2/decidingPercentage";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";

export default function useInnerPoints(labels) {
  const approvalThreshold = useApprovalThreshold();
  const supportThreshold = useSupportThreshold();
  const decisionSince = useDecidingSince();
  const decidingEnd = useDecidingEndHeight();
  const blockTime = useSelector(blockTimeSelector);

  const gone = decisionSince && decidingEnd ? decidingEnd - decisionSince : 0;
  const seconds = new BigNumber(blockTime)
    .multipliedBy(gone)
    .dividedBy(1000)
    .toNumber();
  const xValue = Math.min(seconds / 3600, labels[labels.length - 1]);
  const [, supportInnerPoint] = useSupportPoints(xValue, supportThreshold);
  const [, approvalInnerPoint] = useApprovalPoints(xValue, approvalThreshold);

  return {
    approvalInnerPoint,
    supportInnerPoint,
  };
}
