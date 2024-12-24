import { find } from "lodash-es";

export function mergeMyVoteToFellowshipReferendaListItem(item, votes = []) {
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
