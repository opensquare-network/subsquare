import KVList from "../../listInfo/kvList";
import React, { useEffect, useMemo, useState } from "react";
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
import User from "../../user";
import useInlineCall from "./useInlineCall";

export default function ReferendumMetadata({
  proposer,
  status = {},
  call,
  shorten,
  onchainData = {},
}) {
  const oneBlockTime = useSelector(blockTimeSelector);
  const blockHeight = useSelector(latestHeightSelector);
  const latestBlockTime = useLatestBlockTime();
  const { state, timeline = [], preImage } = onchainData;
  const { delay = 0, end = 0, threshold, proposalHash, proposal } = status;

  const { hash: inlineHash, call: inlineCall } = useInlineCall(timeline, proposal);

  const [referendumTime, setReferendumTime] = useState({});
  useEffect(() => {
    setReferendumTime(
      getReferendumTime(
        state,
        status,
        timeline,
        oneBlockTime,
        blockHeight,
        latestBlockTime,
      ),
    );
  }, [state, status, timeline, oneBlockTime, blockHeight, latestBlockTime]);
  const { endTime, delayTime, isEndEstimated, isDelayEstimated } = useMemo(
    () => referendumTime,
    [referendumTime],
  );

  // todo: we should handle proposal inline type
  const [hash, setHash] = useState(proposalHash);
  useEffect(() => {
    if (hash) {
      return;
    }

    if (proposal?.lookup?.hash) {
      setHash(proposal?.lookup?.hash);
    } else if (proposal?.legacy?.hash) {
      setHash(proposal?.legacy?.hash);
    } else if (proposal?.inline && inlineHash) {
      setHash(inlineHash);
    } else if (preImage?.hash) {
      setHash(preImage?.hash);
    } else {
      setHash(proposalHash);
    }
  }, [proposal, proposalHash, inlineHash]);

  const [metadata, setMetadata] = useState([]);
  useEffect(() => {
    const data = [
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

    if (call || inlineCall) {
      data.push([
        <Proposal
          key="preimage"
          call={call || inlineCall}
          shorten={shorten}
          referendumIndex={onchainData.referendumIndex}
        />,
      ]);
    }

    setMetadata(data);
  }, [
    proposer,
    hash,
    delay,
    delayTime,
    isDelayEstimated,
    end,
    endTime,
    isEndEstimated,
    threshold,
    call,
    shorten,
    onchainData,
  ]);

  return <KVList title={"Metadata"} data={metadata} showFold={true} />;
}
