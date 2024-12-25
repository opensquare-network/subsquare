import { find } from "lodash-es";

export function mergeMyVoteToDemocracyReferendaListItem(
  item,
  voting = [],
  delegations,
) {
  const myVote = {};

  const vote = find(voting, {
    referendumIndex: item.referendumIndex,
  })?.vote;

  if (vote) {
    myVote.vote = vote;
  }

  if (delegations) {
    myVote.delegations = delegations;
  }

  item.myVote = myVote;

  return item;
}
