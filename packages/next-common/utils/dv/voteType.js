export const VOTE_TYPE = {
  Aye: "Aye",
  Nay: "Nay",
  Abstain: "Abstain",
  NoVote: "No Vote",
};

export default function getVoteType(vote) {
  if (vote?.isSplitAbstain || vote?.isSplit) {
    return VOTE_TYPE.Abstain;
  } else if (vote?.isStandard) {
    return vote.aye ? VOTE_TYPE.Aye : VOTE_TYPE.Nay;
  } else {
    return VOTE_TYPE.NoVote;
  }
}
