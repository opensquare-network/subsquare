import useApi from "next-common/utils/hooks/useApi";
import { useOnchainData } from "next-common/context/post";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { clearReferendaReferendumInfo, setReferendaReferendumInfo } from "../../store/reducers/referenda/info";
import { triggerFetchVotes } from "next-common/store/reducers/gov2ReferendumSlice";

export default function useSubReferendumInfo() {
  const api = useApi();
  const onchain = useOnchainData();
  const { referendumIndex } = onchain;

  const dispatch = useDispatch();
  const votingFinishHeight = useReferendumVotingFinishHeight();
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!api || votingFinishHeight || !api.query.referenda) {
      dispatch(setReferendaReferendumInfo(onchain.info));
      return () => dispatch(clearReferendaReferendumInfo());
    }

    let unsub;
    api.query.referenda.referendumInfoFor(referendumIndex, optionalInfo => {
      if (!isMounted.current || !optionalInfo.isSome) {
        return;
      }

      const info = optionalInfo.unwrap();
      if (!info.isOngoing) {
        return;
      }

      dispatch(setReferendaReferendumInfo(info.asOngoing.toJSON()));
      dispatch(triggerFetchVotes());
    }).then(result => {
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
