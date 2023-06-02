import useApi from "../../utils/hooks/useApi";
import { useOnchainData } from "../../context/post";
import { useDetailType } from "../../context/page";
import { useEffect, useState } from "react";
import useReferendumVotingFinishHeight from "../../context/post/referenda/useReferendumVotingFinishHeight";
import useIsMounted from "../../utils/hooks/useIsMounted";
import { detailPageCategory } from "../../utils/consts/business/category";

function usePalletName() {
  const pageType = useDetailType();

  if (detailPageCategory.GOV2_REFERENDUM === pageType) {
    return "referenda";
  } else if (detailPageCategory.FELLOWSHIP_REFERENDUM === pageType) {
    return "fellowshipReferenda";
  } else {
    return null;
  }
}

export default function useSubReferendaTally() {
  const api = useApi();
  const onchain = useOnchainData();
  const { referendumIndex } = onchain;

  const [tally, setTally] = useState(onchain.tally || onchain?.info?.tally);
  const votingFinishHeight = useReferendumVotingFinishHeight();
  const isMounted = useIsMounted();
  const pallet = usePalletName();

  useEffect(() => {
    if (!api || votingFinishHeight || !api.query[pallet]) {
      return;
    }

    let unsub;
    api.query[pallet].referendumInfoFor(referendumIndex, optionalInfo => {
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
  }, [api, votingFinishHeight, pallet, referendumIndex, isMounted]);

  return tally;
}
