import { useOnchainData, usePostStateInfo } from "next-common/context/post";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { isNil } from "lodash-es";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useTrack } from "next-common/context/post/gov2/track";

function useEnactmentHeight(confirmedAt) {
  const trackInfo = useTrack();
  const onchainData = useOnchainData();
  const { enactment, info } = onchainData || {};
  if (enactment) {
    return enactment.when || 0;
  }

  if (!info?.enactment) {
    return 0;
  }

  const { minEnactmentPeriod } = trackInfo;
  let desired = 0;
  const { after, at } = info.enactment;
  if (!isNil(after)) {
    desired = confirmedAt + after;
  } else if (!isNil(at)) {
    desired = at;
  }

  const minHeight = confirmedAt + minEnactmentPeriod;
  return Math.max(desired, minHeight);
}

export default function useEnactmentPercentage() {
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const stateInfo = usePostStateInfo();
  const { indexer: { blockHeight: confirmedAt = 0 } = {} } = stateInfo || {};
  const when = useEnactmentHeight(confirmedAt);

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
