import { sortVotes } from "next-common/utils/democracy/votes/passed/common";
import extractDirectVotes from "next-common/utils/gov2/votes/directVotes";
import extractDelegations from "next-common/utils/gov2/votes/delegationVotes";
import normalizeVotingOfEntry from "next-common/utils/gov2/votes/normalize";
import BigNumber from "bignumber.js";

export default async function fetchAndNormalizeVotes(
  api,
  trackId,
  referendumIndex,
) {
  const voting = await api.query.convictionVoting.votingFor.entries();
  const mapped = voting.map((item) => normalizeVotingOfEntry(item));

  const directVotes = extractDirectVotes(mapped, referendumIndex, api);
  const delegationVotes = extractDelegations(mapped, trackId, directVotes);
  const all = [...directVotes, ...delegationVotes];
  const filtered = all.filter((vote) => BigNumber(vote.votes) > 0);
  return sortVotes(filtered);
}
