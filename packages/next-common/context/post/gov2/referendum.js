import { useOnchainData, useTimelineData } from "../index";
import findLast from "lodash.findlast";

export function useDecidingSince() {
  const onchain = useOnchainData();
  return onchain.info?.deciding?.since;
}

export function useConfirming() {
  const onchain = useOnchainData();
  return onchain.info?.deciding?.confirming;
}

export function useConfirmingStarted() {
  const timeline = useTimelineData();
  const startedItem = findLast(
    timeline,
    (item) => item.name === "ConfirmStarted"
  );
  return startedItem?.indexer?.blockHeight;
}
