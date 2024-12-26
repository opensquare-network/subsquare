// packages/next-common/utils/hooks/fellowship/useFellowshipVotes.js `normalizeVotingRecord`

export function getMyVoteMarkFellowshipReferendaItems(myVote) {
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
