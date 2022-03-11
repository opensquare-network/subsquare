import User from "next-common/components/user";
import Links from "next-common/components/links";
import KVList from "next-common/components/kvList";
import { referendumState } from "next-common/utils/consts/referendum";
import BlockValue from "./blockValue";
import { useBestNumber, useBlockTime } from "next-common/utils/hooks";
import { useApi } from "utils/hooks";
import MotionProposal from "../../../components/motion/motionProposal";
import React from "react";
import useLatestBlockTime from "next-common/utils/hooks/useBlockTime";
import BigNumber from "bignumber.js";

export default function ReferendumMetadata({
  proposer,
  status = {},
  preimage,
  chain,
  onchainData = {},
}) {
  const api = useApi(chain);
  const blockTime = useBlockTime(api);
  const oneBlockTime = blockTime?.toNumber() || 0;
  const bestNumber = useBestNumber(api);
  const blockHeight = bestNumber?.toNumber() || 0;
  const latestBlockTime = useLatestBlockTime(api, blockHeight);

  const proposerElement = (
    <>
      <User add={proposer} fontSize={14} />
      <Links chain={chain} address={proposer} style={{ marginLeft: 8 }} />
    </>
  );

  const { delay = 0, end = 0, threshold } = status;

  let isEndEstimated = false;
  let isDelayEstimated = false;
  const { state, timeline = [] } = onchainData;
  let delayTime, endTime;

  const endTimelineItem = timeline.find((item) =>
    [referendumState.Passed, referendumState.NotPassed].includes(item.method)
  );
  if (state?.state === referendumState.Executed) {
    const executedTimelineItem = timeline.find(
      (item) => item.method === referendumState.Executed
    );
    endTime = endTimelineItem.indexer.blockTime;
    delayTime = executedTimelineItem?.indexer.blockTime;
  } else if (
    [referendumState.Passed, referendumState.NotPassed].includes(
      state?.state
    ) &&
    blockTime
  ) {
    endTime = endTimelineItem.indexer.blockTime;
    delayTime = new BigNumber(oneBlockTime)
      .multipliedBy(delay)
      .plus(endTime)
      .toNumber();
    isDelayEstimated = true;
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

  const metadata = [
    ["Proposer", proposerElement],
    [
      "Delay",
      <BlockValue
        key="delay"
        height={delay}
        time={delayTime}
        isEstimated={isDelayEstimated}
      />,
    ],
    [
      "End",
      <BlockValue
        key="end"
        height={end}
        time={endTime}
        isEstimated={isEndEstimated}
      />,
    ],
    ["Threshold", threshold],
  ];
  if (preimage) {
    metadata.push([
      <MotionProposal
        key="preimage"
        motion={{ proposal: preimage.call }}
        chain={chain}
      />,
    ]);
  }

  return <KVList title={"Metadata"} data={metadata} />;
}
