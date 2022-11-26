import { useDecidingSince } from "next-common/context/post/gov2/referendum";
import { useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { useApprovalCurve } from "next-common/context/post/gov2/curve";
import { useEffect, useState } from "react";
import { useDecision } from "next-common/context/post/gov2/track";

export default function useApprovalThreshold() {
  const decisionPeriod = useDecision();
  const decidingSince = useDecidingSince();
  const latestHeight = useSelector(latestHeightSelector);
  const approvalCurve = useApprovalCurve();
  const [threshold, setThreshold] = useState(null);

  const gone = latestHeight - decidingSince;
  useEffect(() => {
    if (!decidingSince || gone < 0) {
      return;
    }

    setThreshold(approvalCurve(Math.min(gone / decisionPeriod, 1)));
  }, [gone, decisionPeriod, approvalCurve, decidingSince]);

  return threshold;
}
