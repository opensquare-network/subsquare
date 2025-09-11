import { useOnchainData, useTimelineData } from "../index";
import { findLast, findLastIndex, isNil } from "lodash-es";
import { useConfirmPeriod } from "next-common/context/post/gov2/track";
import { gov2State } from "next-common/utils/consts/state";

export function useDecidingSince() {
  const onchain = useOnchainData();
  return onchain.info?.deciding?.since;
}

export function useSubmittedAt() {
  const onchain = useOnchainData();
  return onchain.info?.submitted;
}

export function useConfirming() {
  const onchain = useOnchainData();
  return onchain.info?.deciding?.confirming;
}

export function useConfirmingStarted() {
  const confirming = useConfirming();
  const period = useConfirmPeriod();
  if (isNil(confirming) || isNil(period)) {
    return null;
  }

  return confirming - period;
}

export function useConfirmedHeight() {
  const timeline = useTimelineData();
  const confirmedItem = findLast(timeline, (item) => item.name === "Confirmed");
  return confirmedItem?.indexer?.blockHeight;
}

// last confirm aborted height
export function useConfirmingAborted() {
  const timeline = useTimelineData();
  const abortedItem = findLast(
    timeline,
    (item) => item.name === "ConfirmAborted",
  );
  return abortedItem?.indexer?.blockHeight;
}

export function useConfirmTimelineData() {
  const timeline = useTimelineData();
  return timeline.filter((item) => {
    return [
      "ConfirmStarted",
      "ConfirmAborted",
      "Confirmed",
      gov2State.Rejected,
    ].includes(item.name);
  });
}

export function useConfirmTimelineFinishedPairs() {
  let pairs;

  const confirms = useConfirmTimelineData();
  const lastAbortedIndex = findLastIndex(confirms || [], (confirm) =>
    ["ConfirmAborted", "Confirmed", gov2State.Rejected].includes(confirm?.name),
  );

  const arrStartedAndAborted = confirms.slice(
    0,
    lastAbortedIndex ? lastAbortedIndex + 1 : 0,
  );

  pairs = arrStartedAndAborted.reduce((res, _value, idx, arr) => {
    if (idx % 2 === 0) {
      res.push(arr.slice(idx, idx + 2));
    }
    return res;
  }, []);

  return pairs;
}
