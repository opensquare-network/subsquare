import { useDecision } from "next-common/context/post/gov2/track";
import { useDecidingSince } from "next-common/context/post/gov2/referendum";
import { useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { useSupportCurve } from "next-common/context/post/gov2/curve";
import { useEffect, useState } from "react";
import isNil from "lodash.isnil";

export default function useSupportThreshold() {
  const decisionPeriod = useDecision();
  const decidingSince = useDecidingSince();
  const latestHeight = useSelector(latestHeightSelector);
  const supportCurve = useSupportCurve();
  const [threshold, setThreshold] = useState(null);

  useEffect(() => {
    if (isNil(decidingSince)) {
      return;
    }

    const gone = latestHeight - decidingSince;
    setThreshold(supportCurve(Math.min(gone / decisionPeriod, 1)));
  }, [latestHeight, decisionPeriod, supportCurve, decidingSince]);

  return threshold;
}
