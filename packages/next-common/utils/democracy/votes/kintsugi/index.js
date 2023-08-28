import { normalizeVotingOfEntry, sortVotesByBalance } from "../passed/common";

function extractVotes(mapped = [], targetReferendumIndex) {
  return mapped.reduce((result, accountVoting) => {
    const {
      account,
      voting: { votes },
    } = accountVoting;
    for (const vote of votes) {
      if (vote[0].toNumber() === targetReferendumIndex) {
        const aye = vote[1].aye.toJSON();
        const balance = vote[1].balance.toString();
        result.push({
          account,
          isDelegating: false,
          aye,
          balance,
          votes: balance,
        });
      }
    }

    return result;
  }, []);
}

export default async function getKintsugiReferendumVotes(
  api,
  referendumIndex,
  height,
) {
  let blockApi = api;
  if (height) {
    const blockHash = await api.rpc.chain.getBlockHash(height);
    blockApi = await api.at(blockHash);
  }

  const voting = await blockApi.query.democracy?.votingOf.entries();
  const mapped = (voting || []).map((item) => normalizeVotingOfEntry(item));
  const filtered = extractVotes(mapped, referendumIndex);
  return sortVotesByBalance(filtered);
}
