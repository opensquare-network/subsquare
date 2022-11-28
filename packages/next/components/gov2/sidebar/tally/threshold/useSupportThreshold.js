import { useSupportCurve } from "next-common/context/post/gov2/curve";
import { useMemo } from "react";
import isNil from "lodash.isnil";
import useDecidingPercentage from "./useDecidingPercentage";

export default function useSupportThreshold() {
  const supportCurve = useSupportCurve();
  const percentage = useDecidingPercentage();

  return useMemo(() => {
    if (isNil(percentage)) {
      return;
    }

    return supportCurve(percentage);
  }, [percentage, supportCurve]);
}
