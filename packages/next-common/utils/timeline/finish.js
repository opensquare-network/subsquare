import { gov2State } from "next-common/utils/consts/state";

// Final states of a gov2 referendum, used to determine its voting finish point.
// "Confirmed" is not part of gov2State so it's appended explicitly.
export const referendumFinishStates = [
  gov2State.Approved,
  gov2State.Rejected,
  gov2State.TimedOut,
  gov2State.Cancelled,
  gov2State.Killed,
  "Confirmed",
];

export function getReferendumFinishItem(timeline = []) {
  return timeline.find((item) => referendumFinishStates.includes(item.name));
}

export function getReferendumFinishIndexer(timeline = []) {
  return getReferendumFinishItem(timeline)?.indexer;
}

export function getReferendumFinishTime(timeline = []) {
  return getReferendumFinishItem(timeline)?.indexer?.blockTime;
}
