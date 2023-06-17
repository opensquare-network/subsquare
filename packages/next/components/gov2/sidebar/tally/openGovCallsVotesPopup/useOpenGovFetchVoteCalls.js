import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVoteCalls,
  fetchVoteExtrinsics,
  voteCallsSelector,
} from "next-common/store/reducers/gov2ReferendumSlice";
import { useChainSettings } from "next-common/context/chain";
import { useOnchainData } from "next-common/context/post";

export default function useOpenGovFetchVoteCalls() {
  const { referendumIndex } = useOnchainData();
  const { useVoteCall } = useChainSettings();
  const { allAye = [], allNay = [], allAbstain = [] } = useSelector(voteCallsSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    if (useVoteCall) {
      dispatch(fetchVoteCalls(referendumIndex));
    } else {
      dispatch(fetchVoteExtrinsics(referendumIndex));
    }
  }, [dispatch, referendumIndex, useVoteCall]);

  return { allAye, allNay, allAbstain };
}
