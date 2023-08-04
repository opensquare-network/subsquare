import { referendumVoteFinishedStatusArray } from "next-common/utils/democracy/referendum";

// function calcExpirationHeight(voteFinishHeight, conviction) {
//
// }

export default function useVoteExpiration(vote, referendumTimeline = []) {
  // api.consts?.[module]?.voteLockingPeriod

  if (!vote.isStandard) {
    return {
      hasLock: false,
    };
  }

  const maybeDemocracyFinishedItem = (referendumTimeline || []).some((item) =>
    referendumVoteFinishedStatusArray.includes(item.method),
  );
  if (maybeDemocracyFinishedItem) {
    console.log(maybeDemocracyFinishedItem);
  }
}
