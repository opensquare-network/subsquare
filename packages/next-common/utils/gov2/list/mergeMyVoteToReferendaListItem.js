import { find } from "lodash-es";

export function mergeMyVoteToReferendaListItem(
  item,
  voting = [],
  delegations = [],
) {
  if (!voting.length && !delegations.length) {
    return item;
  }

  const myVote = {};

  const trackVoting = find(voting, { trackId: item.track });
  const trackDelegations = find(delegations, { trackId: item.track });

  const votes = trackVoting?.isDelegating
    ? trackVoting?.delegatedVotes
    : trackVoting?.votes;

  if (!votes?.length) {
    return item;
  }

  const vote = find(votes, { referendumIndex: item.referendumIndex })?.vote;

  if (vote) {
    myVote.vote = vote;
  }

  if (trackDelegations) {
    myVote.delegations = trackDelegations;
  }

  item.myVote = myVote;

  return item;
}
