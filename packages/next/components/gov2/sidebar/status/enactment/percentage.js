import { useOnchainData, usePostStateInfo } from "next-common/context/post";
import { useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { useEffect, useState } from "react";
import isNil from "lodash.isnil";

export default function useEnactmentPercentage() {
  const latestHeight = useSelector(latestHeightSelector);
  const stateInfo = usePostStateInfo();
  const { indexer: { blockHeight: confirmedAt = 0 } = {} } = stateInfo || {};
  const onchainData = useOnchainData();
  const { enactment: { when = 0 } = {} } = onchainData || {};

  const [percentage, setPercentage] = useState(0);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (isNil(latestHeight)) {
      setRemaining(0);
      return setPercentage(0);
    }

    if (latestHeight >= when) {
      setRemaining(0);
      return setPercentage(100);
    }

    setRemaining(when - latestHeight);
    const gone = latestHeight - confirmedAt;
    setPercentage(Number((gone / (when - confirmedAt)) * 100).toFixed(2));
  }, [confirmedAt, latestHeight, when]);

  return {
    percentage,
    period: when - confirmedAt,
    remaining: remaining,
  };
}
