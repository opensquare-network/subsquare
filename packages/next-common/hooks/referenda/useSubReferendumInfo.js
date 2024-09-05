import { useOnchainData } from "next-common/context/post";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { useMountedState } from "react-use";
import {
  clearReferendaReferendumInfo,
  setReferendaReferendumInfo,
} from "../../store/reducers/referenda/info";
import { triggerFetchVotes } from "next-common/store/reducers/referenda/votes";
import { useContextApi } from "next-common/context/api";

export default function useSubReferendumInfo(pallet = "referenda") {
  const api = useContextApi();
  const onchain = useOnchainData();
  const { referendumIndex } = onchain;

  const dispatch = useDispatch();
  const votingFinishHeight = useReferendumVotingFinishHeight();
  const isMounted = useMountedState();

  useEffect(() => {
    if (!api || votingFinishHeight || !api.query.referenda) {
      dispatch(setReferendaReferendumInfo(onchain.info));
      return () => dispatch(clearReferendaReferendumInfo());
    }

    let unsub;
    api.query[pallet]
      .referendumInfoFor(referendumIndex, (optionalInfo) => {
        if (!isMounted() || !optionalInfo.isSome) {
          return;
        }

        const info = optionalInfo.unwrap();
        if (!info.isOngoing) {
          return;
        }

        dispatch(setReferendaReferendumInfo(info.asOngoing.toJSON()));
        if (pallet === "referenda") {
          dispatch(triggerFetchVotes());
        }
      })
      .then((result) => {
        unsub = result;
      });

    return () => {
      if (unsub) {
        unsub();
      }
      dispatch(clearReferendaReferendumInfo());
    };
  }, [
    api,
    votingFinishHeight,
    referendumIndex,
    isMounted,
    pallet,
    dispatch,
    onchain.info,
  ]);
}
