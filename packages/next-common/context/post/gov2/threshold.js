import { isNil } from "lodash-es";
import { useMemo } from "react";
import { useApprovalCurve, useSupportCurve } from "./curve";
import { useDecidingEndPercentage } from "./decidingPercentage";

export function useApprovalThreshold() {
  const approvalCurve = useApprovalCurve();
  const percentage = useDecidingEndPercentage();

  return useMemo(() => {
    if (isNil(percentage)) {
      return null;
    }

    return approvalCurve(percentage);
  }, [percentage, approvalCurve]);
}

export function useSupportThreshold() {
  const supportCurve = useSupportCurve();
  const percentage = useDecidingEndPercentage();

  return useMemo(() => {
    if (isNil(percentage)) {
      return null;
    }

    return supportCurve(percentage);
  }, [percentage, supportCurve]);
}
