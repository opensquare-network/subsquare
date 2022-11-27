import { useApprovalCurve } from "next-common/context/post/gov2/curve";
import { useMemo } from "react";
import isNil from "lodash.isnil";
import useDecidingPercentage from "./useDecidingPercentage";

export default function useApprovalThreshold() {
  const approvalCurve = useApprovalCurve();
  const percentage = useDecidingPercentage();

  return useMemo(() => {
    if (isNil(percentage)) {
      return;
    }

    return approvalCurve(percentage);
  }, [percentage, approvalCurve]);
}
