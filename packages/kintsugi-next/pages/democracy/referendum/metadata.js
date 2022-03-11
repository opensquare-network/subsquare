import User from "next-common/components/user";
import Links from "next-common/components/links";
import KVList from "next-common/components/kvList";
import { referendumState } from "next-common/utils/consts/referendum";
import BlockValue from "./blockValue";
import { useBlockTime } from "next-common/utils/hooks";
import { useApi } from "utils/hooks";
import MotionProposal from "../../../components/motion/motionProposal";
import React from "react";

export default function ReferendumMetadata({
  proposer,
  status = {},
  preimage,
  chain,
  onchainData = {},
}) {
  const api = useApi(chain);
  const blockTime = useBlockTime(api);

  const proposerElement = (
    <>
      <User add={proposer} fontSize={14} />
      <Links chain={chain} address={proposer} style={{ marginLeft: 8 }} />
    </>
  );

  const { delay, end, threshold } = status;

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
    [referendumState.Passed, referendumState.NotPassed].includes(state?.state)
  ) {
    endTime = endTimelineItem.indexer.blockTime;
    delayTime = blockTime.mul(delay).plus(endTime).toNumber();
    isDelayEstimated = true;
  } else if (state?.state === referendumState.Started) {
    const startedTimelineItem = timeline.find(
      (item) => item.method === referendumState.Started
    );
    const startTime = startedTimelineItem?.indexer.blockTime;
    const startHeight = startedTimelineItem.indexer.blockHeight;
    if (startTime) {
      endTime = blockTime
        .mul(end - startHeight)
        .plus(startTime)
        .toNumber();
      delayTime = blockTime
        .mul(end + delay - startHeight)
        .plus(startTime)
        .toNumber();
      isDelayEstimated = true;
      isEndEstimated = true;
    }
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
