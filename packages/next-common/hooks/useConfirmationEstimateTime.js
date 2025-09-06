import { isNil } from "lodash-es";
import {
  useRevertApprovalCurveFunc,
  useRevertSupportCurveFunc,
} from "next-common/context/post/gov2/revertCurve";
import { useEffect, useState } from "react";
import { useDecision } from "next-common/context/post/gov2/track";
import { useDecidingSince } from "next-common/context/post/gov2/referendum";
import BigNumber from "bignumber.js";
import {
  useEstimateBlocksTime,
  useEstimateTimestampAtBlockHeight,
} from "next-common/utils/hooks";

function useTimeByBlocks(blocks = 0) {
  const result = useEstimateBlocksTime(blocks);
  return result || "";
}

export default function useConfirmationEstimateTime({
  approvePercentage,
  supportPercentage,
}) {
  const decisionPeriod = useDecision();
  const decidingSince = useDecidingSince();

  const revertApprovalFunc = useRevertApprovalCurveFunc();
  const revertSupportFunc = useRevertSupportCurveFunc();

  const [approvalX, setApprovalX] = useState();
  const [supportX, setSupportX] = useState();

  const [estimatedApprovalHeight, setEstimatedApprovalHeight] = useState();
  const [estimatedApprovalBlocks, setEstimatedApprovalBlocks] = useState();
  const [estimatedSupportHeight, setEstimatedSupportHeight] = useState();
  const [estimatedSupportBlocks, setEstimatedSupportBlocks] = useState();
  const [estimated, setEstimated] = useState();
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

    setEstimatedApprovalHeight(
      new BigNumber(decisionPeriod)
        .multipliedBy(approvalX)
        .plus(decidingSince)
        .toFixed(0, BigNumber.ROUND_UP),
    );
    setEstimatedSupportHeight(
      new BigNumber(decisionPeriod)
        .multipliedBy(supportX)
        .plus(decidingSince)
        .toFixed(0, BigNumber.ROUND_UP),
    );
  }, [decisionPeriod, decidingSince, approvalX, supportX]);

  useEffect(() => {
    if (isNil(estimatedApprovalHeight) || isNil(estimatedSupportHeight)) {
      return;
    }

    setEstimated(
      Math.max(
        parseInt(estimatedApprovalHeight),
        parseInt(estimatedSupportHeight),
      ),
    );
  }, [estimatedApprovalHeight, estimatedSupportHeight]);

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

  const estimatedTimeToConfirm = useTimeByBlocks(estimatedBlocks);
  const maybeConfirmAtTimestamp = useEstimateTimestampAtBlockHeight(estimated);

  if (
    new BigNumber(approvalX).gt(1) ||
    new BigNumber(supportX).gt(1) ||
    new BigNumber(approvalX).lt(0) ||
    new BigNumber(supportX).lt(0) ||
    isNil(estimatedBlocks)
  ) {
    return {};
  }

  return {
    estimatedTimeToConfirm,
    maybeConfirmAtTimestamp,
  };
}
