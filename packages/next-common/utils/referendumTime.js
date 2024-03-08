import BigNumber from "bignumber.js";
import { referendumState } from "./consts/referendum";
import { isNil } from "lodash-es";

export default function getReferendumTime(
  state,
  status,
  timeline,
  oneBlockTime,
  blockHeight = 0,
  latestBlockTime,
) {
  let delayTime, endTime;
  let isEndEstimated = false;
  let isDelayEstimated = false;

  const { delay = 0, end = 0 } = status;

  const endTimelineItem = timeline.find((item) =>
    [referendumState.Passed, referendumState.NotPassed].includes(item.method),
  );

  if (
    [
      referendumState.Executed,
      referendumState.PreimageInvalid,
      referendumState.PreimageMissing,
    ].includes(state?.state)
  ) {
    const executedTimelineItem = timeline.find(
      (item) => item.method === referendumState.Executed,
    );
    endTime = endTimelineItem.indexer.blockTime;
    delayTime = executedTimelineItem?.indexer.blockTime;
  } else if (
    [referendumState.Passed, referendumState.NotPassed].includes(
      state?.state,
    ) &&
    oneBlockTime
  ) {
    endTime = endTimelineItem.indexer.blockTime;
    const now = new Date().getTime();
    if (!isNil(blockHeight)) {
      const expectedHeight = endTimelineItem.indexer.blockHeight + delay;
      delayTime = new BigNumber(oneBlockTime)
        .multipliedBy(expectedHeight - blockHeight)
        .plus(now)
        .toNumber();
      isDelayEstimated = true;
    } else {
      isDelayEstimated = false;
    }
  } else if (
    state?.state === referendumState.Started &&
    oneBlockTime &&
    latestBlockTime
  ) {
    endTime = new BigNumber(oneBlockTime)
      .multipliedBy(end - blockHeight)
      .plus(latestBlockTime)
      .toNumber();
    delayTime = new BigNumber(oneBlockTime)
      .multipliedBy(delay)
      .plus(endTime)
      .toNumber();
    isDelayEstimated = true;
    isEndEstimated = true;
  }

  return {
    endTime,
    delayTime,
    isEndEstimated,
    isDelayEstimated,
  };
}
