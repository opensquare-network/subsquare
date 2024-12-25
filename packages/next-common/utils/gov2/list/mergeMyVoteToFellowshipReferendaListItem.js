import { find } from "lodash-es";

export function mergeMyVoteToFellowshipReferendaListItem(item, votes = []) {
  if (!votes.length) {
    return item;
  }

  const myVote = {};

  const vote = find(votes, {
    referendumIndex: item.referendumIndex,
  });

  if (vote) {
    myVote.vote = vote;
  }

  item.myVote = myVote;

  return item;
}
