import { getReferendumVotesFromVotingOf } from "./votingOf";
import { getReferendumVotesFromVotersFor } from "./votersFor";
import { emptyVotes } from "./common";

export async function getReferendumVotesByHeight(api, referendumIndex) {
  if (api.query.democracy.votingOf) {
    return await getReferendumVotesFromVotingOf(api, referendumIndex);
  } else if (api.query.democracy.votersFor) {
    return await getReferendumVotesFromVotersFor(api, referendumIndex);
  }

  return emptyVotes;
}
