// packages/next-common/utils/hooks/fellowship/useFellowshipVotes.js `normalizeVotingRecord`

export function getMyVoteMarkFellowshipReferendaItems(vote) {
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
