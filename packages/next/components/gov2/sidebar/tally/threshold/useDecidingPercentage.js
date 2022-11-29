import { useDecision } from "next-common/context/post/gov2/track";
import { useDecidingSince } from "next-common/context/post/gov2/referendum";
import { useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { useMemo } from "react";
import isNil from "lodash.isnil";
import { useTimelineData } from "next-common/context/post";
import { gov2State } from "next-common/utils/consts/state";

export function useDecidingEndPercentage() {
  const decisionPeriod = useDecision();
  const decidingSince = useDecidingSince();
  const latestHeight = useSelector(latestHeightSelector);
  const timeline = useTimelineData();
  const endItem = (timeline || []).find((item) =>
    [
      gov2State.Approved,
      gov2State.Cancelled,
      gov2State.Rejected,
      gov2State.Timeout,
      gov2State.Killed,
      "Confirmed",
    ].includes(item.name)
  );

  const endHeight = endItem ? endItem.indexer.blockHeight : latestHeight;

  return useMemo(() => {
    if (isNil(decidingSince) || isNil(endHeight)) {
      return null;
    }

    const gone = endHeight - decidingSince;
    return Math.min(gone / decisionPeriod, 1);
  }, [decisionPeriod, decidingSince, endHeight]);
}

export default function useDecidingPercentage() {
  const decisionPeriod = useDecision();
  const decidingSince = useDecidingSince();
  const latestHeight = useSelector(latestHeightSelector);

  return useMemo(() => {
    if (isNil(decidingSince) || isNil(latestHeight)) {
      return null;
    }

    const gone = latestHeight - decidingSince;
    return Math.min(gone / decisionPeriod, 1);
  }, [decisionPeriod, decidingSince, latestHeight]);
}
