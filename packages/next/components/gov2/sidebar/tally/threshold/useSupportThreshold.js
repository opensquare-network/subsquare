import { useSupportCurve } from "next-common/context/post/gov2/curve";
import { useMemo } from "react";
import isNil from "lodash.isnil";
import { useDecidingEndPercentage } from "./useDecidingPercentage";

export default function useSupportThreshold() {
  const supportCurve = useSupportCurve();
  const percentage = useDecidingEndPercentage();

  return useMemo(() => {
    if (isNil(percentage)) {
      return null;
    }

    return supportCurve(percentage);
  }, [percentage, supportCurve]);
}
