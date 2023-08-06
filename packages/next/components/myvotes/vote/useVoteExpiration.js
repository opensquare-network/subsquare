import { useIsReferenda } from "next-common/components/profile/votingHistory/common";
import { useEffect, useState } from "react";
import useApi from "next-common/utils/hooks/useApi";
import getVoteEndInfo from "./utils/getVoteEndInfo";

export default function useVoteExpiration(voteItem) {
  const isReferenda = useIsReferenda();
  const [period, setPeriod] = useState();
  const api = useApi();

  useEffect(() => {
    const pallet = isReferenda ? "convictionVoting" : "democracy";
    if (api) {
      setPeriod(api.consts?.[pallet]?.voteLockingPeriod.toNumber());
    }
  }, [api, isReferenda]);

  return getVoteEndInfo(voteItem, period, isReferenda);
}
