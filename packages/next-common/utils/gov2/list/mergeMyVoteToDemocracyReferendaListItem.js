// packages/next-common/components/myvotes/democracy/useSubMyDemocracyVoting/index.js

import { find, isNil, pick } from "lodash-es";

export function mergeMyVoteToDemocracyReferendaListItem(item, voting) {
  if (isNil(voting)) {
    return item;
  }

  const myVote = {};

  const votes = voting.isDelegating ? voting.delegatedVotes : voting.votes;

  if (!votes?.length) {
    return item;
  }

  const vote = find(votes, { referendumIndex: item.referendumIndex })?.vote;

  if (vote) {
    let resolvedVote;
    if (voting.isDelegating) {
      resolvedVote = {
        ...vote,
        ...pick(voting, ["balance", "conviction"]),
      };
    } else {
      resolvedVote = vote;
    }

    myVote.vote = resolvedVote;
  }

  if (voting.delegations) {
    myVote.delegations = voting.delegations;
  }

  item.myVote = myVote;

  return item;
}
