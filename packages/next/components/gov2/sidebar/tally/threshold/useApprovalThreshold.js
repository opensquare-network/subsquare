import { useApprovalCurve } from "next-common/context/post/gov2/curve";
import { useMemo } from "react";
import isNil from "lodash.isnil";
import { useDecidingEndPercentage } from "./useDecidingPercentage";

export default function useApprovalThreshold() {
  const approvalCurve = useApprovalCurve();
  const percentage = useDecidingEndPercentage();

  return useMemo(() => {
    if (isNil(percentage)) {
      return;
    }

    return approvalCurve(percentage);
  }, [percentage, approvalCurve]);
}
