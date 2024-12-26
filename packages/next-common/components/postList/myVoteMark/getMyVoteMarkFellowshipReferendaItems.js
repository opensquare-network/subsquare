// packages/next-common/utils/hooks/fellowship/useFellowshipVotes.js `normalizeVotingRecord`

import { isNil } from "lodash-es";

export function getMyVoteMarkFellowshipReferendaItems(myVote) {
  if (isNil(myVote)) {
    return null;
  }

  const { vote } = myVote;

  return [
    {
      label: "Vote",
      value: vote?.isAye === false ? "Nay" : "Aye",
    },
    {
      label: "Votes",
      value: vote.votes,
    },
  ];
}
