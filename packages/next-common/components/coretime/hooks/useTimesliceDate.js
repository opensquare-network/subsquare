import { isNil } from "lodash-es";
import dayjs from "dayjs";
import useRelayChainBlockTime from "next-common/context/coretime/hooks/useRelayChainBlockTime";
import useAhmLatestHeightSnapshot from "next-common/hooks/ahm/useAhmLatestHeightSnapshot";
import { calculateBlockTimestamp } from "next-common/hooks/common/useBlockTimestamp";
import { CORETIME_TIMESLICE_PERIOD } from "next-common/utils/consts/coretime";

// Returns a converter from a Coretime timeslice to its estimated date.
export default function useTimesliceDate() {
  const relayChainBlockTime = useRelayChainBlockTime();
  const { latestHeight, isLoading } = useAhmLatestHeightSnapshot();

  return (timeslice) => {
    if (isNil(timeslice) || isLoading || isNil(latestHeight)) {
      return null;
    }

    const timestamp = calculateBlockTimestamp(
      Number(timeslice) * CORETIME_TIMESLICE_PERIOD,
      relayChainBlockTime,
      latestHeight,
    );

    return isNil(timestamp) ? null : dayjs(timestamp);
  };
}
