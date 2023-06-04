import { useOnchainData } from "../../context/post";
import { useEffect, useState } from "react";
import useReferendumVotingFinishHeight from "../../context/post/referenda/useReferendumVotingFinishHeight";
import useIsMounted from "../../utils/hooks/useIsMounted";
import useApi from "../../utils/hooks/useApi";

export default function useSubFellowshipTally() {
  const api = useApi();
  const onchain = useOnchainData();
  const [tally, setTally] = useState(onchain.tally || onchain?.info?.tally);
  const { referendumIndex } = onchain;
  const votingFinishHeight = useReferendumVotingFinishHeight();
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!api || votingFinishHeight || !api.query.fellowshipReferenda) {
      return;
    }

    let unsub;
    api.query.fellowshipReferenda.referendumInfoFor(referendumIndex, optionalInfo => {
      if (!isMounted.current || !optionalInfo.isSome) {
        return;
      }

      const info = optionalInfo.unwrap();
      if (!info.isOngoing) {
        return;
      }

      setTally(info.asOngoing.tally.toJSON());
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
