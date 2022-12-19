import { normalizeVotingOfEntry } from "./votes/passed/common";

let votingOfEntries;

export async function getDemocracyBeenDelegatedListByAddress(api, address) {
  if (!votingOfEntries) {
    votingOfEntries = await api.query.democracy.votingOf.entries();
  }

  const beenDelegated = [];
  for (const entry of votingOfEntries) {
    const { account, voting } = normalizeVotingOfEntry(entry, api);
    if (!voting.isDelegating) {
      continue;
    }

    const delegating = voting.asDelegating.toJSON();
    if (delegating.target === address) {
      beenDelegated.push({ delegator: account, ...delegating });
    }
  }

  return beenDelegated;
}
