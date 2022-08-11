import { normalizeVotingOfEntry, sortVotes } from "../passed/common";

function extractVotes(mapped = [], targetReferendumIndex) {
  return mapped.reduce((result, accountVoting) => {
    const { account, voting: { votes } } = accountVoting;
    for (const vote of votes) {
      if (vote[0].toNumber() === targetReferendumIndex) {
        result.push({
          account,
          isDelegating: false,
          ...vote[1].toJSON()
        })
      }
    }

    return result;
  }, [])
}

export default async function getKintsugiReferendumVotes(api, referendumIndex, height) {
  let blockApi = api;
  if (height) {
    const blockHash = await api.rpc.chain.getBlockHash(height);
    blockApi = await api.at(blockHash);
  }

  const voting = await blockApi.query.democracy.votingOf.entries();
  const mapped = voting.map(item => normalizeVotingOfEntry(item, blockApi));
  const filtered = extractVotes(mapped, referendumIndex);
  const sorted = sortVotes(filtered);

  const allAye = sorted.filter(v => v.aye);
  const allNay = sorted.filter(v => !v.aye);

  return { allAye, allNay }
}
