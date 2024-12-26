import { find, pick } from "lodash-es";

export function mergeMyVoteToReferendaListItem(
  item,
  voting = [],
  delegations = [],
) {
  if (!voting.length && !delegations.length) {
    return item;
  }

  const trackVoting = find(voting, { trackId: item.track });

  if (!trackVoting) {
    return item;
  }

  const myVote = pick(trackVoting, ["isCasting", "isDelegating"]);

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

  const trackDelegations = find(delegations, { trackId: item.track });
  if (trackDelegations) {
    myVote.delegations = trackDelegations;
  }

  item.myVote = myVote;

  return item;
}
