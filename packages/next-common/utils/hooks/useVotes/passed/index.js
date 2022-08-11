import { getReferendumVotesFromVotingOf } from "./votingOf";
import { getReferendumVotesFromVotersFor } from "./votersFor";
import { emptyVotes } from "./common";

export async function getReferendumVotesByHeight(api, height, referendumIndex) {
  const blockHash = await api.rpc.chain.getBlockHash(height);
  const blockApi = await api.at(blockHash);

  if (blockApi.query.democracy.votingOf) {
    return await getReferendumVotesFromVotingOf(blockApi, referendumIndex);
  } else if (blockApi.query.democracy.votersFor) {
    return await getReferendumVotesFromVotersFor(blockApi, blockHash, referendumIndex);
  }

  return emptyVotes;
}
