import { useOnchainData } from "next-common/context/post";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { useMountedState } from "react-use";
import {
  clearFellowshipReferendumInfo,
  setFellowshipReferendumInfo,
} from "next-common/store/reducers/fellowship/info";
import { clearReferendaReferendumInfo } from "next-common/store/reducers/referenda/info";
import { useContextApi } from "next-common/context/api";

export default function useSubFellowshipReferendumInfo() {
  const api = useContextApi();
  const onchain = useOnchainData();
  const { referendumIndex } = onchain;

  const dispatch = useDispatch();
  const votingFinishHeight = useReferendumVotingFinishHeight();
  const isMounted = useMountedState();

  useEffect(() => {
    if (!api || votingFinishHeight || !api.query.fellowshipReferenda) {
      dispatch(setFellowshipReferendumInfo(onchain.info));
      return () => dispatch(clearFellowshipReferendumInfo());
    }

    let unsub;
    api.query.fellowshipReferenda
      .referendumInfoFor(referendumIndex, (optionalInfo) => {
        if (!isMounted() || !optionalInfo.isSome) {
          return;
        }

        const info = optionalInfo.unwrap();
        if (!info.isOngoing) {
          return;
        }

        dispatch(setFellowshipReferendumInfo(info.asOngoing.toJSON()));
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
  }, [api, votingFinishHeight, referendumIndex, isMounted]);
}
