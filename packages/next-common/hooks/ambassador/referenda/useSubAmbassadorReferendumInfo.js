import { useContextApi } from "next-common/context/api";
import { useOnchainData } from "next-common/context/post";
import { useDispatch } from "react-redux";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { useMountedState } from "react-use";
import { useEffect } from "react";
import {
  clearAmbassadorReferendumInfo,
  setAmbassadorReferendumInfo,
} from "next-common/store/reducers/ambassador/info";

export default function useSubAmbassadorReferendumInfo() {
  const api = useContextApi();
  const onchain = useOnchainData();
  const { referendumIndex } = onchain;

  const dispatch = useDispatch();
  const votingFinishHeight = useReferendumVotingFinishHeight();
  const isMounted = useMountedState();

  useEffect(() => {
    if (!api || votingFinishHeight || !api.query.fellowshipReferenda) {
      dispatch(setAmbassadorReferendumInfo(onchain.info));
      return () => dispatch(clearAmbassadorReferendumInfo());
    }

    let unsub;
    api.query.ambassadorReferenda
      .referendumInfoFor(referendumIndex, (optionalInfo) => {
        if (!isMounted() || !optionalInfo.isSome) {
          return;
        }

        const info = optionalInfo.unwrap();
        if (!info.isOngoing) {
          return;
        }

        dispatch(setAmbassadorReferendumInfo(info.asOngoing.toJSON()));
      })
      .then((result) => {
        unsub = result;
      });

    return () => {
      if (unsub) {
        unsub();
      }
      dispatch(clearAmbassadorReferendumInfo());
    };
  }, [api, votingFinishHeight, referendumIndex, isMounted]);
}
