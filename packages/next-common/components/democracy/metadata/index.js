import KVList from "../../listInfo/kvList";
import React from "react";
import useLatestBlockTime from "../../../utils/hooks/useBlockTime";
import getReferendumTime from "../../../utils/referendumTime";
import BlockValue from "./blockValue";
import Proposal from "../../proposal";
import Threshold from "./threshold";
import { useSelector } from "react-redux";
import {
  blockTimeSelector,
  latestHeightSelector,
} from "../../../store/reducers/chainSlice";
import useIsMounted from "../../../utils/hooks/useIsMounted";
import User from "../../user";

export default function ReferendumMetadata({
  proposer,
  status = {},
  call,
  shorten,
  onchainData = {},
}) {
  const isMounted = useIsMounted();
  const oneBlockTime = useSelector(blockTimeSelector);
  const blockHeight = useSelector(latestHeightSelector);
  const latestBlockTime = useLatestBlockTime(blockHeight, isMounted);

  const { delay = 0, end = 0, threshold, proposalHash, proposal } = status;
  const { state, timeline = [] } = onchainData;

  const { endTime, delayTime, isEndEstimated, isDelayEstimated } =
    getReferendumTime(
      state,
      status,
      timeline,
      oneBlockTime,
      blockHeight,
      latestBlockTime
    );

  let hash = proposalHash;
  // todo: we should handle proposal inline type
  if (!hash && proposal?.lookup?.hash) {
    hash = proposal?.lookup?.hash;
  } else if (proposal?.legacy?.hash) {
    hash = proposal?.legacy?.hash;
  }

  const metadata = [
    ["Proposer", <User add={proposer} fontSize={14} key="user" />],
    ["Hash", hash],
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
    ["Threshold", <Threshold threshold={threshold} key="threshold" />],
  ];

  if (call) {
    metadata.push([
      <Proposal
        key="preimage"
        call={call}
        shorten={shorten}
        referendumIndex={onchainData.referendumIndex}
      />,
    ]);
  }

  return <KVList title={"Metadata"} data={metadata} showFold={true} />;
}
