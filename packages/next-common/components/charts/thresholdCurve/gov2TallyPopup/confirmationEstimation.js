import isNil from "lodash.isnil";
import {
  useRevertApprovalCurveFunc,
  useRevertSupportCurveFunc,
} from "next-common/context/post/gov2/revertCurve";
import { useEffect, useState } from "react";
import { usePostState } from "next-common/context/post";
import { gov2State } from "next-common/utils/consts/state";
import { useDecision } from "next-common/context/post/gov2/track";
import { useDecidingSince } from "next-common/context/post/gov2/referendum";
import BigNumber from "bignumber.js";

function PercentageGuard({ approvePercentage, supportPercentage, children }) {
  if (isNil(approvePercentage) || isNil(supportPercentage)) {
    return null;
  }

  return children;
}

function Estimation({ approvePercentage, supportPercentage }) {
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

  if (
    new BigNumber(approvalX).gt(1) ||
    new BigNumber(supportX).gt(1) ||
    isNil(estimated)
  ) {
    return null;
  }

  return `Estimated confirmation at ${estimated}`;
}

export default function ConfirmationEstimation({
  approvePercentage,
  supportPercentage,
}) {
  const state = usePostState();
  if (gov2State.Deciding !== state) {
    return null;
  }

  return (
    <PercentageGuard
      approvePercentage={approvePercentage}
      supportPercentage={supportPercentage}
    >
      <Estimation
        approvePercentage={approvePercentage}
        supportPercentage={supportPercentage}
      />
    </PercentageGuard>
  );
}
