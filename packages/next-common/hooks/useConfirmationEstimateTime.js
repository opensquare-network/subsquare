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
  useEstimateTimeFromNowToBlockHeight,
  useEstimateTimestampAtBlockHeight,
} from "next-common/utils/hooks";

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
  const [estimatedSupportHeight, setEstimatedSupportHeight] = useState();
  const [estimated, setEstimated] = useState();

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

  const estimatedTimeToConfirm = useEstimateTimeFromNowToBlockHeight(estimated);
  const maybeConfirmAtTimestamp = useEstimateTimestampAtBlockHeight(estimated);

  if (
    new BigNumber(approvalX).gt(1) ||
    new BigNumber(supportX).gt(1) ||
    new BigNumber(approvalX).lt(0) ||
    new BigNumber(supportX).lt(0) ||
    isNil(estimated)
  ) {
    return {};
  }

  return {
    estimatedTimeToConfirm,
    maybeConfirmAtTimestamp,
  };
}
