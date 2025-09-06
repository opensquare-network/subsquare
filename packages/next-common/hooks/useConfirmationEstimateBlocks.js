import { useDecision } from "next-common/context/post/gov2/track";
import {
  useRevertApprovalCurveFunc,
  useRevertSupportCurveFunc,
} from "next-common/context/post/gov2/revertCurve";
import { useEffect, useState, useMemo } from "react";
import BigNumber from "bignumber.js";
import { isNil } from "lodash-es";
import { useDecidingSince } from "next-common/context/post/gov2/referendum";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";

// how many relay chain blocks left to a referendum confirmation
export default function useConfirmationEstimateBlocks(
  approvePercentage,
  supportPercentage,
) {
  const decisionPeriod = useDecision();
  const decidingSince = useDecidingSince();
  const latestHeight = useAhmLatestHeight();

  const revertApprovalFunc = useRevertApprovalCurveFunc();
  const revertSupportFunc = useRevertSupportCurveFunc();

  const [approvalX, setApprovalX] = useState();
  const [supportX, setSupportX] = useState();

  const [estimatedApprovalBlocks, setEstimatedApprovalBlocks] = useState();
  const [estimatedSupportBlocks, setEstimatedSupportBlocks] = useState();
  const [estimatedBlocks, setEstimatedBlocks] = useState();

  useEffect(() => {
    if (!revertSupportFunc || !revertSupportFunc) {
      return;
    }

    setApprovalX(revertApprovalFunc(approvePercentage));
    setSupportX(revertSupportFunc(supportPercentage));
  }, [
    approvePercentage,
    supportPercentage,
    revertApprovalFunc,
    revertSupportFunc,
  ]);

  useEffect(() => {
    if (isNil(approvalX) || isNil(supportX)) {
      return;
    }

    const approvalBlocks = new BigNumber(decisionPeriod)
      .multipliedBy(approvalX)
      .toFixed(0, BigNumber.ROUND_UP);
    setEstimatedApprovalBlocks(approvalBlocks);
    const supportBlocks = new BigNumber(decisionPeriod)
      .multipliedBy(supportX)
      .toFixed(0, BigNumber.ROUND_UP);
    setEstimatedSupportBlocks(supportBlocks);
  }, [decisionPeriod, approvalX, supportX]);

  useEffect(() => {
    if (isNil(estimatedApprovalBlocks) || isNil(estimatedSupportBlocks)) {
      return;
    }

    setEstimatedBlocks(
      Math.max(
        parseInt(estimatedApprovalBlocks),
        parseInt(estimatedSupportBlocks),
      ),
    );
  }, [estimatedApprovalBlocks, estimatedSupportBlocks]);

  return useMemo(() => {
    if (isNil(estimatedBlocks) || isNil(latestHeight)) {
      return null;
    }

    const expected = decidingSince + estimatedBlocks;
    return Math.max(expected - latestHeight, 0);
  }, [estimatedBlocks, latestHeight, decidingSince]);
}
