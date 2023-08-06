import { useIsReferenda } from "next-common/components/profile/votingHistory/common";
import getVoteEndInfo from "./utils/getVoteEndInfo";
import useVoteLockingPeriod from "next-common/hooks/useVoteLockingPeriod";

export default function useVoteExpiration(voteItem) {
  const isReferenda = useIsReferenda();
  const period = useVoteLockingPeriod(
    isReferenda ? "convictionVoting" : "democracy",
  );

  return getVoteEndInfo(voteItem, period, isReferenda);
}
