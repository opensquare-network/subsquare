import { referendumStatusSelector } from "next-common/store/reducers/referendumSlice";
import { useSelector } from "react-redux";
import { useOnchainData } from "next-common/context/post";
import { useMemo } from "react";
import useDemocracyTally from "next-common/context/post/democracy/referendum/tally";

export default function useDemocracyReferendumStatus() {
  const onchainStatus = useSelector(referendumStatusSelector);
  const onchainData = useOnchainData();
  const contextTally = useDemocracyTally();

  return useMemo(() => {
    if (onchainStatus) {
      return onchainStatus;
    } else {
      const statusFromServer =
        onchainData?.status || onchainData?.info?.ongoing || onchainData?.meta;
      return {
        ...statusFromServer,
        tally: contextTally, // we set this because we update only tally on server side. Status is not updated in time.
      };
    }
  }, [onchainStatus, onchainData, contextTally]);
}
