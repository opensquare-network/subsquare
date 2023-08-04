import { useIsReferenda } from "next-common/components/profile/votingHistory/common";
import useApi from "next-common/utils/hooks/useApi";
import { useEffect, useState } from "react";

// function calcExpirationHeight(voteFinishHeight, conviction) {
//
// }

export default function useVoteExpiration(voteItem) {
  console.log("voteItem", voteItem);
  const { vote, referendumInfo } = voteItem;
  const isReferenda = useIsReferenda();
  const pallet = isReferenda ? "convictionVoting" : "democracy";
  const api = useApi();
  console.log("referendumInfo", referendumInfo);

  const [period, setPeriod] = useState();

  useEffect(() => {
    if (api) {
      setPeriod(api.consts?.[pallet]?.voteLockingPeriod.toNumber());
    }
  }, [api, pallet]);
  console.log("period", period);

  if (!vote.isStandard) {
    return {
      hasLock: false,
    };
  }

  // todo: 1. get the vote finished height.
  // todo: 2. if not finished, no lock.
  // todo: 3. if finished and result is same with my vote, calc the unlock block height
}
