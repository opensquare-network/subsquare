import KVList from "../../listInfo/kvList";
import React, { useEffect, useMemo, useState } from "react";
import useLatestBlockTime from "../../../utils/hooks/useBlockTime";
import getReferendumTime from "../../../utils/referendumTime";
import BlockValue from "./blockValue";
import Threshold from "./threshold";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "../../../store/reducers/chainSlice";
import useDemocracyThreshold from "../../../context/post/democracy/referendum/threshold";
import { useDemocracyReferendumHash } from "next-common/hooks/democracy/useDemocracyReferendumHash";
import Copyable from "next-common/components/copyable";
import AddressUser from "next-common/components/user/addressUser";
import useChainOrScanHeight from "next-common/hooks/height";

export default function ReferendumMetadata({
  proposer,
  status = {},
  call,
  shorten,
  onchainData = {},
}) {
  const oneBlockTime = useSelector(blockTimeSelector);
  const blockHeight = useChainOrScanHeight();
  const latestBlockTime = useLatestBlockTime();
  const { state, timeline = [] } = onchainData;
  const { delay = 0, end = 0 } = status;
  const threshold = useDemocracyThreshold();

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

  const hash = useDemocracyReferendumHash();

  const [metadata, setMetadata] = useState([]);
  useEffect(() => {
    const data = [
      ["Proposer", <AddressUser add={proposer} key="user" />],
      ["Hash", <Copyable key="hash">{hash}</Copyable>],
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
