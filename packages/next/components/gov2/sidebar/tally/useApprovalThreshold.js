import { useDecisionBlocks } from "../status/useDecisionPercentage";
import { useDecidingSince } from "next-common/context/post/gov2/referendum";
import { useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { useApprovalCurve } from "next-common/context/post/gov2/curve";
import { useEffect, useState } from "react";

export default function useApprovalThreshold() {
  const decisionBlocks = useDecisionBlocks();
  const decidingSince = useDecidingSince();
  const latestHeight = useSelector(latestHeightSelector);
  const approvalCurve = useApprovalCurve();
  const [threshold, setThreshold] = useState(null);

  const gone = latestHeight - decidingSince;
  useEffect(() => {
    if (gone < 0) {
      return;
    }

    setThreshold(approvalCurve(gone / decisionBlocks));
  }, [gone, decisionBlocks, approvalCurve]);

  return threshold;
}
