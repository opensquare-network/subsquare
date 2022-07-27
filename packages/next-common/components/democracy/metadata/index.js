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
  finalizedHeightSelector,
} from "../../../store/reducers/chainSlice";
import UserWithLink from "../../user/userWithLink";

export default function ReferendumMetadata({
  api,
  proposer,
  status = {},
  call,
  shorten,
  chain,
  onchainData = {},
}) {
  const oneBlockTime = useSelector(blockTimeSelector);
  const blockHeight = useSelector(finalizedHeightSelector);
  const latestBlockTime = useLatestBlockTime(api, blockHeight);

  const { delay = 0, end = 0, threshold } = status;
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

  const metadata = [
    ["Proposer", <UserWithLink chain={chain} address={proposer} />],
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
    ["Threshold", <Threshold chain={chain} threshold={threshold} />],
  ];

  if (call) {
    metadata.push([
      <Proposal
        key="preimage"
        call={call}
        chain={chain}
        shorten={shorten}
        referendumIndex={onchainData.referendumIndex}
      />,
    ]);
  }

  return <KVList title={"Metadata"} data={metadata} showFold={true} />;
}
