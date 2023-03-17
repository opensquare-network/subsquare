import { getReferendumVotesByHeight } from "./passed";
import { getReferendumVotesFromVotingOf } from "./passed/votingOf";

export default async function getReferendumVotes(api, referendumIndex, height) {
  if (height) {
    return await getReferendumVotesByHeight(api, height, referendumIndex);
  }

  return await getReferendumVotesFromVotingOf(api, referendumIndex);
}
