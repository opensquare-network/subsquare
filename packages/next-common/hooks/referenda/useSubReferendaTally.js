import useApi from "../../utils/hooks/useApi";
import { useOnchainData } from "../../context/post";
import { useEffect, useState } from "react";
import useReferendumVotingFinishHeight from "../../context/post/referenda/useReferendumVotingFinishHeight";
import useIsMounted from "../../utils/hooks/useIsMounted";
import { useDispatch } from "react-redux";
import { triggerFetchVotes } from "../../store/reducers/gov2ReferendumSlice";

export default function useSubReferendaTally() {
  const api = useApi();
  const onchain = useOnchainData();
  const { referendumIndex } = onchain;

  const dispatch = useDispatch();

  const [tally, setTally] = useState(onchain.tally || onchain?.info?.tally);
  const votingFinishHeight = useReferendumVotingFinishHeight();
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!api || votingFinishHeight || !api.query.referenda) {
      return;
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

      setTally(info.asOngoing.tally.toJSON());

      dispatch(triggerFetchVotes());
    }).then(result => {
      unsub = result;
    });

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, votingFinishHeight, referendumIndex, isMounted]);

  return tally;
}
