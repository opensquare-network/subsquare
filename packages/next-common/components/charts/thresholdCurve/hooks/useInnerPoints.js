import {
  useApprovalThreshold,
  useSupportThreshold,
} from "next-common/context/post/gov2/threshold";
import BigNumber from "bignumber.js";
import {
  useApprovalPoints,
  useSupportPoints,
} from "next-common/components/charts/thresholdCurve/annotations";
import { useDecidingEndHeight } from "next-common/context/post/gov2/decidingPercentage";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useBeginHeight } from "next-common/utils/hooks/referenda/detail/useReferendumBlocks";
import { useBlockSteps } from "next-common/utils/hooks/referenda/detail/useReferendumBlocks";
import { useMemo } from "react";
import useChainOrScanHeight from "next-common/hooks/height";
import useReferendumCurveData from "next-common/utils/hooks/referenda/detail/useReferendumCurveData";

export default function useInnerPoints(labels) {
  const approvalThreshold = useApprovalThreshold();
  const supportThreshold = useSupportThreshold();
  const beginHeight = useBeginHeight();
  const decidingEnd = useDecidingEndHeight();
  const blockTime = useSelector(blockTimeSelector);

  const gone = decidingEnd ? decidingEnd - beginHeight : 0;

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

export function useCurrentHeightPoints() {
  const { supportData, approvalData, totalHours } = useReferendumCurveData();
  const currentHeight = useChainOrScanHeight();
  const steps = useBlockSteps();
  const beginHeight = useBeginHeight();

  const xValue = useMemo(() => {
    const index = Math.floor((currentHeight - beginHeight) / steps);
    return Math.min(index, Math.ceil(totalHours));
  }, [beginHeight, currentHeight, steps, totalHours]);

  const [, supportInnerPoint] = useSupportPoints(
    xValue,
    supportData?.[xValue] / 100,
  );
  const [, approvalInnerPoint] = useApprovalPoints(
    xValue,
    approvalData?.[xValue] / 100,
  );

  return {
    approvalInnerPoint,
    supportInnerPoint,
  };
}
