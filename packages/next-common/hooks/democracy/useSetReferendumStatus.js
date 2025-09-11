// set referendum status to redux
import { useDispatch, useSelector } from "react-redux";
import {
  referendumStatusSelector,
  setReferendumStatus,
} from "next-common/store/reducers/referendumSlice";
import { useEffect } from "react";
import { useOnchainData } from "next-common/context/post";
import useDemocracyTally from "next-common/context/post/democracy/referendum/tally";

export default function useSetReferendumStatus() {
  const dispatch = useDispatch();
  const referendumStatus = useSelector(referendumStatusSelector);
  const contextTally = useDemocracyTally();
  const onchainData = useOnchainData();

  useEffect(() => {
    const statusFromServer =
      onchainData?.status || onchainData?.info?.ongoing || onchainData?.meta;
    dispatch(
      setReferendumStatus({
        ...statusFromServer,
        tally: contextTally, // we set this because we update only tally on server side. Status is not updated in time.
      }),
    );
  }, [contextTally, dispatch, onchainData]);

  return referendumStatus;
}
