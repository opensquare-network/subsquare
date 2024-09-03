import { useOnchainData, useTimelineData } from "../index";
import { findLastIndex, findLast } from "lodash-es";

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
  const timeline = useTimelineData();
  const startedItem = findLast(
    timeline,
    (item) => item.name === "ConfirmStarted",
  );
  return startedItem?.indexer?.blockHeight;
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
    return ["ConfirmStarted", "ConfirmAborted", "Confirmed"].includes(
      item.name,
    );
  });
}

export function useConfirmTimelineFailPairs() {
  let pairs = [];

  const confirms = useConfirmTimelineData();
  const lastAbortedIndex = findLastIndex(
    confirms || [],
    (confirm) => confirm.name === "ConfirmAborted",
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
