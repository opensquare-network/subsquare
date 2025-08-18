export const VOTE_TYPE = {
  Aye: "Aye",
  Nay: "Nay",
  Abstain: "Abstain",
  NoVote: "No Vote",
};

export default function getVoteType(vote) {
  if (!vote) return VOTE_TYPE.NoVote;

  if (vote.isSplitAbstain) {
    return VOTE_TYPE.Abstain;
  } else if (vote.isStandard) {
    if (vote.aye) {
      return VOTE_TYPE.Aye;
    } else {
      return VOTE_TYPE.Nay;
    }
  } else if (vote.isAbstain) {
    return VOTE_TYPE.Abstain;
  }
  return VOTE_TYPE.NoVote;
}
