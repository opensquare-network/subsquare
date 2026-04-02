import { useMemo } from "react";
import { useTimelineData } from "next-common/context/post";

export default function useDecisionStartedTime() {
  const timeline = useTimelineData();

  return useMemo(() => {
    return (timeline ?? []).find((item) => item.name === "DecisionStarted")
      ?.indexer?.blockTime;
  }, [timeline]);
}
